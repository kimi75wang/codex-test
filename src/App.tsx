import { FormEvent, useMemo, useState } from "react";

type Filter = "all" | "active" | "completed";

type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const initialTodos: Todo[] = [
  { id: 1, text: "写一版 React + TypeScript Todo List", completed: true },
  { id: 2, text: "补上筛选和统计功能", completed: false },
  { id: 3, text: "优化一下页面样式", completed: false }
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filteredTodos = useMemo(() => {
    if (filter === "active") {
      return todos.filter((todo) => !todo.completed);
    }

    if (filter === "completed") {
      return todos.filter((todo) => todo.completed);
    }

    return todos;
  }, [filter, todos]);

  const activeCount = todos.filter((todo) => !todo.completed).length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const text = inputValue.trim();
    if (!text) {
      return;
    }

    setTodos((currentTodos) => [
      {
        id: Date.now(),
        text,
        completed: false
      },
      ...currentTodos
    ]);
    setInputValue("");
  };

  const toggleTodo = (id: number) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const removeTodo = (id: number) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const clearCompleted = () => {
    setTodos((currentTodos) => currentTodos.filter((todo) => !todo.completed));
  };

  return (
    <main className="page-shell">
      <section className="todo-card">
        <p className="eyebrow">React + TypeScript Demo</p>
        <h1>Todo List</h1>
        <p className="subtitle">支持新增、完成切换、删除和状态筛选。</p>

        <form className="todo-form" onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            placeholder="输入待办事项..."
            aria-label="待办事项"
          />
          <button type="submit">添加</button>
        </form>

        <div className="toolbar">
          <div className="filters" role="tablist" aria-label="筛选待办">
            {(["all", "active", "completed"] as Filter[]).map((option) => (
              <button
                key={option}
                type="button"
                className={filter === option ? "is-active" : ""}
                onClick={() => setFilter(option)}
              >
                {option === "all"
                  ? "全部"
                  : option === "active"
                    ? "未完成"
                    : "已完成"}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ghost-button"
            onClick={clearCompleted}
            disabled={!todos.some((todo) => todo.completed)}
          >
            清除已完成
          </button>
        </div>

        <ul className="todo-list">
          {filteredTodos.length === 0 ? (
            <li className="empty-state">当前筛选条件下没有待办事项。</li>
          ) : (
            filteredTodos.map((todo) => (
              <li key={todo.id} className="todo-item">
                <label>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                  />
                  <span className={todo.completed ? "completed" : ""}>
                    {todo.text}
                  </span>
                </label>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => removeTodo(todo.id)}
                  aria-label={`删除 ${todo.text}`}
                >
                  删除
                </button>
              </li>
            ))
          )}
        </ul>

        <footer className="todo-footer">
          <span>{activeCount} 项未完成</span>
          <span>总计 {todos.length} 项</span>
        </footer>
      </section>
    </main>
  );
}
