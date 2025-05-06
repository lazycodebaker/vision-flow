#ifndef NODE_PROCESSOR_H
#define NODE_PROCESSOR_H

#include <opencv2/opencv.hpp>
#include <nlohmann/json.hpp>
#include <string>

#include "plugin_manager.hpp"

class NodeProcessor
{
public:
    NodeProcessor();
    NodeProcessor(PluginManager &pluginManager);
    ~NodeProcessor();

    

    cv::Mat process(const nlohmann::json &graph, const std::string &inputPath);

private:
    PluginManager &pluginManager_;
};

#endif