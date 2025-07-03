#!/bin/bash

# Almalex Project Startup Script
# Creates tmux sessions for frontend and backend development

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo "Error: tmux is not installed. Please install tmux first."
    exit 1
fi

# Define paths
BACKEND_PATH="$HOME/personal/almalex/backend"
FRONTEND_PATH="$HOME/personal/almalex/frontend"

# Check if directories exist
if [ ! -d "$BACKEND_PATH" ]; then
    echo "Error: Backend directory does not exist: $BACKEND_PATH"
    exit 1
fi

if [ ! -d "$FRONTEND_PATH" ]; then
    echo "Error: Frontend directory does not exist: $FRONTEND_PATH"
    exit 1
fi

# Kill existing sessions if they exist
tmux kill-session -t almalex_backend 2>/dev/null
tmux kill-session -t almalex_frontend 2>/dev/null

echo "Creating backend session..."
# Create backend session with first window
tmux new-session -d -s almalex_backend -c "$BACKEND_PATH"

# Create 3 additional windows (total of 4)
tmux new-window -t almalex_backend -c "$BACKEND_PATH"
tmux new-window -t almalex_backend -c "$BACKEND_PATH"
tmux new-window -t almalex_backend -c "$BACKEND_PATH"

# Setup backend windows
tmux send-keys -t almalex_backend:1 "source .venv/bin/activate && nvim ." Enter
tmux send-keys -t almalex_backend:2 "source .venv/bin/activate && claude" Enter
tmux send-keys -t almalex_backend:3 "source .venv/bin/activate" Enter
tmux send-keys -t almalex_backend:4 "lazygit" Enter

# switch to first window
tmux select-window -t almalex_backend:1

echo "Creating frontend session..."
# Create frontend session
tmux new-session -d -s almalex_frontend -c "$FRONTEND_PATH"

# Create 3 additional windows (total of 4)
tmux new-window -t almalex_frontend -c "$FRONTEND_PATH"
tmux new-window -t almalex_frontend -c "$FRONTEND_PATH"
tmux new-window -t almalex_frontend -c "$FRONTEND_PATH"

# Setup frontend panes
tmux send-keys -t almalex_frontend:1 "nvim ." Enter
tmux send-keys -t almalex_frontend:2 "claude" Enter
tmux send-keys -t almalex_frontend:4 "lazygit" Enter

# Switch to first window
tmux select-window -t almalex_frontend:1

echo "Sessions created successfully!"
echo "Backend session: almalex_backend"
echo "Frontend session: almalex_frontend"
echo ""
echo "To attach to sessions:"
echo "  tmux attach-session -t almalex_backend"
echo "  tmux attach-session -t almalex_frontend"
echo ""
echo "To switch between windows (when attached):"
echo "  Ctrl+b n (next window)"
echo "  Ctrl+b p (previous window)"
echo "  Ctrl+b 0-3 (jump to window number)"
