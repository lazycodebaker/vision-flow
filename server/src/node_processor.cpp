
#include <opencv2/opencv.hpp>
#include <nlohmann/json.hpp>
#include <stdexcept>

#include "node_processor.hpp"
#include "utils.hpp"

// NodeProcessor::NodeProcessor(PluginManager &pluginManager) : pluginManager_(pluginManager) {}

NodeProcessor::NodeProcessor() : pluginManager_(*static_cast<PluginManager *>(nullptr))
{
    throw std::runtime_error("Default constructor is not supported. Use the one with PluginManager.");
}

NodeProcessor::~NodeProcessor() {}
cv::Mat NodeProcessor::process(const nlohmann::json &graph, const std::string &inputPath)
{
    return cv::Mat(); // or actual implementation
}
