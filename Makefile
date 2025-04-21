all:
	cd server && cmake -S . -B build && cmake --build build
	./server/build/bin/vision-flow-canvas &
	bun run dev
