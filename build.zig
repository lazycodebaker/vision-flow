const std = @import("std");

pub fn build(b: *std.Build) void {
    const build_cpp = b.addSystemCommand(&[_][]const u8{
        "cmake", "-S", ".", "-B", "build",
    });

    const compile_cpp = b.addSystemCommand(&[_][]const u8{
        "cmake", "--build", "build",
    });
    compile_cpp.step.dependOn(&build_cpp.step);

    const run_cpp_server = b.addSystemCommand(&[_][]const u8{
        "./build/bin/vision-flow-canvas",
    });
    run_cpp_server.step.dependOn(&compile_cpp.step);

    const run_vite = b.addSystemCommand(&[_][]const u8{
        "bun", "run", "dev",
    });

    const start = b.step("start", "Start C++ server and Vite");
    start.dependOn(&run_cpp_server.step);
    start.dependOn(&run_vite.step);
}
