// for demo server (/Users/hannakhonskaya/codes/React/socially/src/app/tasks/page.tsx)
interface Task {
    id: number;
    title: string;
    completed: boolean;
}

interface CreateTask {
    title: string;
}

let tasks: Task[] = [
    {
        id: 1,
        title: "Task 1",
        completed: false,
    },
    {
        id: 2,
        title: "Task 2",
        completed: true,
    },
]

export async function GET() {
    return Response.json(tasks);
}

export async function POST(request: Request) {
    try {
        const body: CreateTask = await request.json();

        if (!body.title) {
            return Response.json({ error: "Title is required" }, { status: 400 });
        }

        const newTask: Task = {
            id: tasks.length + 1,
            title: body.title,
            completed: false,
        }
        tasks.push(newTask);
        return Response.json(newTask, { status: 201 });

    } catch (error) {
        console.error("Failed to create task:", error);
        return Response.json({ error: "Invalid request body:" }, { status: 400 });
    }
}

export async function DELETE(request: Request) { 
    try {
        const { searchParams } = new URL(request.url);
        const id = parseInt(searchParams.get("id") || "");

        if (!id) {
            return Response.json({ error: "ID is required" }, { status: 400 });
        }   

        const taskIndex = tasks.findIndex((task) => task.id === id);
        if (taskIndex === -1) {
            return Response.json({ error: "Task not found" }, { status: 404 });
        }

        tasks = tasks.filter((task) => task.id !== id);
        return Response.json({ success: true });
        
    } catch (error) {
        console.error("Failed to delete task:", error);
        return Response.json({ error: "Invalid request" }, { status: 400 });
    }
}