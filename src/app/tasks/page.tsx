// for demo server (/Users/hannakhonskaya/codes/React/socially/src/app/api/tasks/route.ts)

async function TasksPage() {
  const resp = await fetch('http://localhost:3000/api/tasks');
  const tasks = await resp.json();

  console.log('tasks', tasks);
  return (
    <div>paTasksPagege</div>
  )
}

export default TasksPage;