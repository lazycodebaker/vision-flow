#ifndef PLUGIN_INTERFACE_H
#define PLUGIN_INTERFACE_H

#include <string>

struct PluginResult
{
    unsigned char *data;
    int width;
    int height;
    int channels;
    int hasData;
};

using ProcessFrameFunc = PluginResult (*)(const unsigned char *, int, int, int, const char *);
using FreeResultFunc = void (*)(PluginResult *);

#endif