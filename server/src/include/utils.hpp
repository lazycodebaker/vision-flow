#ifndef UTILS_H
#define UTILS_H

#include <string>

void ensureDirectoryExists(const std::string &path);

std::string getLibraryPath(const std::string &featureName);

#endif