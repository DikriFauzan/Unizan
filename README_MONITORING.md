Monitoring & Observability (GEN18)
- /v1/admin/metrics  -> Prometheus-compatible metrics (basic counters)
- /v1/admin/health   -> Aggregate health (superkey/emergent etc.)
- metrics-exporter  -> JSON status at http://localhost:9200/metrics

Next steps:
- Wire metrics to Prometheus by adding scrape configs.
- Replace in-memory counters with Prometheus client or pushgateway for persistence.
