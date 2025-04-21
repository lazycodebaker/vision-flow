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

#include "utils.hpp"
void ensureDirectoryExists(const std::string &path)
{
    std::filesystem::create_directories(path);
}

std::string getLibraryPath(const std::string &featureName)
{
    return "plugins/" + static_cast<std::string>(LIB_PREFIX) + featureName + LIB_SUFFIX;
}
