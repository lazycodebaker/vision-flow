#ifndef SERVER_H
#define SERVER_H

#include <httplib.h>
#include <memory>
#include <string>

class Server
{
public:
    Server(const std::string &host, int port);
    void start();

private:
    std::string host_;
    int port_;
    std::unique_ptr<httplib::Server> server_;
};

#endif