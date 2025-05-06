#ifdef _WIN32
#define LIB_PREFIX ""
#define LIB_SUFFIX ".dll"
#elif defined(__APPLE__)
#define LIB_PREFIX "lib"
#define LIB_SUFFIX ".dylib"
#else
#define LIB_PREFIX "lib"
#define LIB_SUFFIX ".so"
#endif

#include <fstream>
#include <filesystem>
#include <unistd.h>
#include <limits.h>
#include <mach-o/dyld.h>

#include "utils.hpp"
void ensureDirectoryExists(const std::string &path)
{
    std::filesystem::create_directories(path);
}

std::string getExecutablePath()
{
    char result[PATH_MAX];
    ssize_t count = readlink("/proc/self/exe", result, PATH_MAX);
    if (count != -1)
    {
        return std::string(result, count);
    }
    return "";
}

std::string getExecutableDir() {
    char path[PATH_MAX];
    uint32_t size = sizeof(path);
    if (_NSGetExecutablePath(path, &size) == 0) {
        return std::filesystem::canonical(path).parent_path().string();
    }
    return "";
}

std::string getLibraryPath(const std::string &featureName)
{
    std::string pluginDir = std::filesystem::current_path().string() + "/server/plugins";
    return pluginDir + "/" + LIB_PREFIX + featureName + LIB_SUFFIX;
}