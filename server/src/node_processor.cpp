
#include <opencv2/opencv.hpp>
#include <nlohmann/json.hpp>
#include <stdexcept>

#include "node_processor.hpp"
#include "utils.hpp"

NodeProcessor::NodeProcessor(PluginManager &pluginManager) : pluginManager_(pluginManager) {}