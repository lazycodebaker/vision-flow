#!/bin/bash

# Build C++ server
echo "Building C++ server..."
cd server && cmake -S . -B build && cmake --build build
cd ..

# Start the server in the background
echo "Starting C++ server..."
./server/build/bin/vision-flow-canvas &

# Capture PID to stop it later if needed
SERVER_PID=$!

# Start Vite frontend
echo "Starting Vite dev server..."
bun run dev

# When vite exits, kill the server
kill $SERVER_PID
