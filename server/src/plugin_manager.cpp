
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

PluginManager::~PluginManager()
{
    if (handle)
    {
#ifdef _WIN32
        FreeLibrary(handle);
#else
        dlclose(handle);
#endif
    }
}

void *PluginManager::getFunction(const std::string &functionName)
{
    if (!handle)
        return nullptr;

#ifdef _WIN32
    return (void *)GetProcAddress(handle, functionName.c_str());
#else
    return dlsym(handle, functionName.c_str());
#endif
}
