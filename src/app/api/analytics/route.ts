import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ status: "error", message: "Unauthorized" }, { status: 401 });
    }

    try {
        // 1. Task counts
        const { count: totalTasks } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id);

        const { count: completedTasks } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "completed");

        const { count: pendingTasks } = await supabase
            .from("tasks")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("status", "pending");

        const total = totalTasks || 0;
        const completed = completedTasks || 0;
        const pending = pendingTasks || 0;

        // 2. Completion rate
        const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

        // 3. Tasks by priority
        const { data: allTasks } = await supabase
            .from("tasks")
            .select("priority, category")
            .eq("user_id", user.id);

        const priorityMap: Record<string, number> = { low: 0, medium: 0, high: 0 };
        const categoryMap: Record<string, number> = {};

        (allTasks || []).forEach((task) => {
            if (task.priority && priorityMap[task.priority] !== undefined) {
                priorityMap[task.priority]++;
            }
            const cat = task.category || "Uncategorized";
            categoryMap[cat] = (categoryMap[cat] || 0) + 1;
        });

        // 4. Category breakdown (top 10)
        const categoryBreakdown = Object.entries(categoryMap)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        // 5. Weekly activity (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const { data: weeklyLogs } = await supabase
            .from("task_logs")
            .select("action_type, created_at")
            .eq("user_id", user.id)
            .gte("created_at", sevenDaysAgo.toISOString());

        // Build daily activity map
        const dailyActivity: Array<{ date: string; created: number; completed: number }> = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split("T")[0];

            const created = (weeklyLogs || []).filter(
                (log) => log.created_at?.startsWith(dateStr) && log.action_type === "created"
            ).length;
            const completedCount = (weeklyLogs || []).filter(
                (log) => log.created_at?.startsWith(dateStr) && log.action_type === "completed"
            ).length;

            dailyActivity.push({ date: dateStr, created, completed: completedCount });
        }

        // 6. Recent activity (last 15 logs with task titles)
        const { data: recentLogs } = await supabase
            .from("task_logs")
            .select("id, action_type, created_at, task_id")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(15);

        // Fetch task titles for recent logs
        const taskIds = [...new Set((recentLogs || []).map((l) => l.task_id).filter(Boolean))];
        const { data: logTasks } = taskIds.length > 0
            ? await supabase.from("tasks").select("id, title").in("id", taskIds)
            : { data: [] };

        const taskTitleMap = new Map((logTasks || []).map((t) => [t.id, t.title]));

        const recentActivity = (recentLogs || []).map((log) => ({
            _id: log.id,
            actionType: log.action_type,
            created_at: log.created_at,
            taskTitle: taskTitleMap.get(log.task_id) || "Deleted Task",
        }));

        return NextResponse.json(
            {
                status: "success",
                data: {
                    totalTasks: total,
                    completedTasks: completed,
                    pendingTasks: pending,
                    completionRate,
                    priorityBreakdown: priorityMap,
                    categoryBreakdown,
                    dailyActivity,
                    recentActivity,
                },
            },
            {
                headers: {
                    "Cache-Control": "private, max-age=0, stale-while-revalidate=60",
                },
            }
        );
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ status: "error", message: "Internal server error" }, { status: 500 });
    }
}
