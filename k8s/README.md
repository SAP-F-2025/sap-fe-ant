# Kubernetes Deployment Guide

Hướng dẫn triển khai SAP Frontend Application lên Kubernetes với Traefik Ingress Controller.

## Yêu cầu

- Kubernetes cluster (v1.20+)
- kubectl được cấu hình
- Docker registry (DockerHub, Harbor, GCR, ECR, etc.)
- Traefik Ingress Controller đã được cài đặt
- (Optional) cert-manager cho TLS certificates

## Bước 1: Build Docker Image

### 1.1. Build image

```bash
# Build image
docker build -t your-registry/sap-frontend:v1.0.0 .

# Test image locally
docker run -p 8080:80 your-registry/sap-frontend:v1.0.0
```

### 1.2. Push image lên registry

```bash
# Login vào registry
docker login your-registry

# Push image
docker push your-registry/sap-frontend:v1.0.0

# Tag latest
docker tag your-registry/sap-frontend:v1.0.0 your-registry/sap-frontend:latest
docker push your-registry/sap-frontend:latest
```

## Bước 2: Cấu hình Kubernetes Manifests

### 2.1. Cập nhật ConfigMap

Chỉnh sửa `k8s/configmap.yaml` và thay đổi các giá trị API endpoints theo môi trường của bạn:

```yaml
VITE_API_BASE_URL: 'https://your-api.yourdomain.com'
VITE_VERIFICATION_API_BASE_URL: 'https://your-verification-api.yourdomain.com'
VITE_PROCTORING_API_BASE_URL: 'https://your-proctoring-api.yourdomain.com'
VITE_CASDOOR_SERVER_URL: 'https://your-casdoor.yourdomain.com'
```

### 2.2. Cập nhật Deployment

Chỉnh sửa `k8s/deployment.yaml` và thay đổi image registry:

```yaml
image: your-registry/sap-frontend:latest
```

Nếu sử dụng private registry, uncomment và cấu hình imagePullSecrets:

```bash
# Tạo secret cho private registry
kubectl create secret docker-registry regcred \
  --docker-server=your-registry \
  --docker-username=your-username \
  --docker-password=your-password \
  --docker-email=your-email
```

### 2.3. Cập nhật IngressRoute

Chỉnh sửa `k8s/ingressroute.yaml` và thay đổi domain:

```yaml
match: Host(`sap.yourdomain.com`)
```

Cấu hình TLS:

**Option 1: Sử dụng cert-manager (Recommended)**

```yaml
tls:
    certResolver: letsencrypt # Tên cert resolver của bạn
```

**Option 2: Sử dụng existing TLS secret**

```yaml
tls:
    secretName: sap-frontend-tls
```

Để tạo TLS secret thủ công:

```bash
kubectl create secret tls sap-frontend-tls \
  --cert=path/to/cert.pem \
  --key=path/to/key.pem
```

## Bước 3: Deploy lên Kubernetes

### 3.1. Tạo namespace (Optional)

```bash
kubectl create namespace sap
```

### 3.2. Apply manifests

```bash
# Deploy ConfigMap
kubectl apply -f k8s/configmap.yaml

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Deploy Traefik IngressRoute
kubectl apply -f k8s/ingressroute.yaml
```

Hoặc deploy tất cả cùng lúc:

```bash
kubectl apply -f k8s/
```

### 3.3. Kiểm tra deployment

```bash
# Kiểm tra pods
kubectl get pods -l app=sap-frontend

# Kiểm tra logs
kubectl logs -f -l app=sap-frontend

# Kiểm tra service
kubectl get svc sap-frontend

# Kiểm tra ingressroute
kubectl get ingressroute sap-frontend
```

## Bước 4: Verify Application

### 4.1. Kiểm tra health endpoint

```bash
# Port-forward để test local
kubectl port-forward svc/sap-frontend 8080:80

# Test health endpoint
curl http://localhost:8080/health
```

### 4.2. Truy cập qua domain

Đảm bảo DNS record đã được cấu hình trỏ về Traefik LoadBalancer:

```bash
# Lấy Traefik LoadBalancer IP
kubectl get svc -n traefik traefik

# Cấu hình DNS A record
sap.yourdomain.com -> <TRAEFIK_LOADBALANCER_IP>
```

Sau đó truy cập: `https://sap.yourdomain.com`

## Bước 5: Update Application

### 5.1. Build và push image mới

```bash
docker build -t your-registry/sap-frontend:v1.0.1 .
docker push your-registry/sap-frontend:v1.0.1
```

### 5.2. Update deployment

**Option 1: Update image tag trong deployment.yaml và apply lại**

```bash
kubectl apply -f k8s/deployment.yaml
```

**Option 2: Sử dụng kubectl set image**

```bash
kubectl set image deployment/sap-frontend \
  sap-frontend=your-registry/sap-frontend:v1.0.1
```

### 5.3. Rollback nếu cần

```bash
# Xem rollout history
kubectl rollout history deployment/sap-frontend

# Rollback về version trước
kubectl rollout undo deployment/sap-frontend

# Rollback về version cụ thể
kubectl rollout undo deployment/sap-frontend --to-revision=2
```

## Scaling

### Horizontal Pod Autoscaler (HPA)

```bash
# Tạo HPA
kubectl autoscale deployment sap-frontend \
  --cpu-percent=70 \
  --min=2 \
  --max=10

# Hoặc apply HPA manifest
cat <<EOF | kubectl apply -f -
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: sap-frontend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: sap-frontend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
EOF
```

### Manual scaling

```bash
kubectl scale deployment sap-frontend --replicas=5
```

## Monitoring & Logging

### Xem logs

```bash
# Logs của tất cả pods
kubectl logs -l app=sap-frontend --tail=100 -f

# Logs của pod cụ thể
kubectl logs <pod-name> -f

# Logs trước khi pod restart
kubectl logs <pod-name> --previous
```

### Describe resources

```bash
kubectl describe deployment sap-frontend
kubectl describe pod <pod-name>
kubectl describe svc sap-frontend
kubectl describe ingressroute sap-frontend
```

## Troubleshooting

### Pods không start được

```bash
# Kiểm tra events
kubectl get events --sort-by=.metadata.creationTimestamp

# Kiểm tra pod description
kubectl describe pod <pod-name>

# Kiểm tra logs
kubectl logs <pod-name>
```

### Image pull errors

```bash
# Kiểm tra imagePullSecrets
kubectl get secret regcred -o yaml

# Tạo lại secret nếu cần
kubectl delete secret regcred
kubectl create secret docker-registry regcred \
  --docker-server=your-registry \
  --docker-username=your-username \
  --docker-password=your-password
```

### IngressRoute không hoạt động

```bash
# Kiểm tra Traefik logs
kubectl logs -n traefik -l app.kubernetes.io/name=traefik

# Kiểm tra IngressRoute
kubectl describe ingressroute sap-frontend

# Kiểm tra middlewares
kubectl get middleware
kubectl describe middleware sap-frontend-headers
```

### ConfigMap updates không apply

ConfigMap changes không tự động reload. Cần restart pods:

```bash
# Option 1: Rollout restart
kubectl rollout restart deployment/sap-frontend

# Option 2: Delete pods (deployment sẽ tạo lại)
kubectl delete pods -l app=sap-frontend
```

## Clean Up

```bash
# Xóa tất cả resources
kubectl delete -f k8s/

# Hoặc xóa từng resource
kubectl delete ingressroute sap-frontend sap-frontend-http-redirect
kubectl delete middleware sap-frontend-headers https-redirect
kubectl delete deployment sap-frontend
kubectl delete service sap-frontend
kubectl delete configmap sap-frontend-config
```

## Best Practices

1. **Multi-environment**: Tạo namespace riêng cho từng môi trường (dev, staging, prod)
2. **Resource limits**: Luôn set requests và limits cho CPU/Memory
3. **Health checks**: Cấu hình liveness và readiness probes
4. **Security**:
    - Sử dụng non-root user
    - Drop all capabilities
    - Enable TLS
    - Security headers middleware
5. **High Availability**:
    - Ít nhất 2 replicas
    - Pod anti-affinity rules
    - PodDisruptionBudget
6. **Monitoring**:
    - Integrate với Prometheus
    - Setup alerts
    - Log aggregation (ELK, Loki)
7. **CI/CD**: Automate build và deployment process
8. **GitOps**: Sử dụng ArgoCD hoặc FluxCD cho declarative deployments

## References

- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [cert-manager Documentation](https://cert-manager.io/docs/)
- [Docker Documentation](https://docs.docker.com/)
