# Project Learnings, Security, & Scalability Notes

This document contains important architectural notes, security best practices, and scalability considerations for the URL Shortener project.

## 1. Rate Limiting & Scalability (express-rate-limit)
**Date:** 2026-09-15

By default, the `express-rate-limit` package stores IP address tracking data directly in the RAM (memory) of the Node.js server. 

### The Problem with RAM storage:
If you deploy this application across multiple servers (horizontal scaling) behind a Load Balancer, each server will have its own independent memory. An attacker could bypass the rate limit by hitting different servers. For example, if the limit is 5 requests/min, and you have 4 servers, they could potentially make 20 requests/min.

### The Solution:
For a large-scale production app, you should plug `express-rate-limit` into a centralized, in-memory datastore like **Redis**. 
By doing this, all your Node.js servers will share the exact same counters. When one server increments an IP's counter, the other servers instantly know about it.

*Implementation note: You would use the `rate-limit-redis` package to connect the limiter to a Redis instance.*
