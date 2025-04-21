
#include "plugin_manager.hpp"

PluginManager::PluginManager(const std::string &libPath)
{

#ifdef _WIN32
    handle = LoadLibrary(libPath.c_str());
    if (!handle)
    {
        std::cerr << "Error loading plugin (Windows): " << GetLastError() << "\n";
    }
#else
    this->handle = dlopen(libPath.c_str(), RTLD_LAZY);
    if (!this->handle)
    {
        std::cerr << "Error loading plugin (Unix): " << dlerror() << "\n";
    }
#endif
}