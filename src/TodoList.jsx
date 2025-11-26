import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Check, Circle, X, Calendar, Bell } from 'lucide-react';

const TodoList = () => {
    const [todos, setTodos] = useState(() => {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    });
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all'); // all, active, completed

    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    const addTodo = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
            createdAt: new Date().toISOString(),
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
    };

    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    const deleteTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const filteredTodos = todos.filter(todo => {
        if (filter === 'active') return !todo.completed;
        if (filter === 'completed') return todo.completed;
        return true;
    });

    const stats = {
        total: todos.length,
        active: todos.filter(t => !t.completed).length,
        completed: todos.filter(t => t.completed).length
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4 font-sans text-white">
            <div className="w-full max-w-2xl">

                {/* Header Section */}
                <div className="mb-8 text-center">
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-cyan-400 mb-2">
                        Task Master
                    </h1>
                    <p className="text-gray-300 text-lg">Focus on what matters most.</p>
                </div>

                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden">

                    {/* Input Area */}
                    <form onSubmit={addTodo} className="p-6 border-b border-white/10 bg-white/5">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Add a new task..."
                                className="w-full bg-black/20 text-white placeholder-gray-400 rounded-xl py-4 pl-5 pr-14 text-lg focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 p-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg hover:scale-105 transition-transform active:scale-95"
                            >
                                <Plus className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </form>

                    {/* Filters & Stats */}
                    <div className="flex flex-col sm:flex-row justify-between items-center p-4 bg-black/20 text-sm text-gray-300 gap-4">
                        <div className="flex gap-1 bg-black/20 p-1 rounded-xl">
                            {['all', 'active', 'completed'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-lg capitalize transition-all ${filter === f
                                            ? 'bg-white/20 text-white shadow-lg font-medium'
                                            : 'hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-4">
                            <span>{stats.active} active</span>
                            <span>{stats.completed} completed</span>
                        </div>
                    </div>

                    {/* Todo List */}
                    <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3 custom-scrollbar">
                        <AnimatePresence mode="popLayout">
                            {filteredTodos.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="text-center py-12 text-gray-400"
                                >
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Calendar className="w-8 h-8 opacity-50" />
                                    </div>
                                    <p className="text-lg">No tasks found</p>
                                    <p className="text-sm opacity-60">Add a task to get started</p>
                                </motion.div>
                            ) : (
                                filteredTodos.map((todo) => (
                                    <motion.div
                                        key={todo.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                                        className={`group flex items-center gap-4 p-4 rounded-xl border transition-all ${todo.completed
                                                ? 'bg-black/20 border-transparent opacity-60'
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:shadow-lg hover:-translate-y-0.5'
                                            }`}
                                    >
                                        <button
                                            onClick={() => toggleTodo(todo.id)}
                                            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${todo.completed
                                                    ? 'bg-green-500 border-green-500'
                                                    : 'border-gray-400 hover:border-pink-400'
                                                }`}
                                        >
                                            {todo.completed && <Check className="w-3.5 h-3.5 text-white" />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <p className={`text-lg truncate transition-all ${todo.completed ? 'line-through text-gray-500' : 'text-white'
                                                }`}>
                                                {todo.text}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(todo.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => deleteTodo(todo.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Press Enter to add a task</p>
                </div>
            </div>
        </div>
    );
};

export default TodoList;
