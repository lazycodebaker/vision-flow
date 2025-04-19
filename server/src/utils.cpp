#include <fstream>
#include <filesystem>

#include "utils.hpp"

void ensureDirectoryExists(const std::string &path)
{
    std::filesystem::create_directories(path);
}