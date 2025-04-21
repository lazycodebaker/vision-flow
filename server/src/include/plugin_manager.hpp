#ifndef PLUGIN_MANAGER_H
#define PLUGIN_MANAGER_H

#ifdef _WIN32
#include <windows.h>
using LibraryHandle = HMODULE;

#elif defined(__linux__) || defined(__APPLE__)
#include <dlfcn.h>
using LibraryHandle = void *;
#else
#error "Unsupported platform"
#endif

#include <iostream>
#include <string>

class PluginManager
{
public:
    PluginManager(const std::string &libPath);
    ~PluginManager();

private:
    LibraryHandle handle;
};

#endif