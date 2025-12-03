# Task Management Collaborativo - Desafio Técnico

- Front: React + TanStack Router + shadcn/ui + Tailwind + TanStack Query + Zustand + socket.io-client
- Back: Nest.js + TypeORM + RabbitMQ (microservices) + API Gateway híbrido (HTTP + WebSocket)
- Infra: Turborepo monorepo + Docker Compose

## Arquitetura (ASCII)

frontend (web) <--HTTP/WS--> API Gateway (hybrid Nest)
                             |
                             ├──► Auth Service       (RMQ queue: auth_queue)
                             ├──► Tasks Service      (RMQ queue: tasks_queue)
                             └──► Notifications Service (consome task_events_queue → emite notification_events_queue)

API Gateway consome notification_events_queue e entrega via WebSocket (socket.io rooms por userId)

## Decisões técnicas & Trade-offs

- JWT simétrico (HS256) – simples e suficiente para o escopo
- bcrypt para hash de senha
- Rate limiting global 10 req/seg com @nestjs/throttler
- WebSocket com socket.io + rooms por userId (escalável e simples)
- Events broadcast via 2 queues dedicadas (task_events_queue e notification_events_queue) – evita round-robin do RabbitMQ
- Um único DB PostgreSQL (trade-off consciente de tempo vs separação real de DBs)
- synchronize: true em dev, false em prod + migrations prontas para generate
- Adicionado endpoint /api/users?search= (necessário para UI de atribuição) – não estava na spec mas é essencial para usabilidade
- Histórico de alterações em tabela separada TaskHistory
- Notificações persistidas + entregues em tempo real via WS
- UI com shadcn/ui ≥ 6 componentes (DataTable, Dialog, Form, Combobox, Badge, Toast, Skeleton, etc)

Setup monorepo + Docker ≈ 2h  
Auth + Gateway + JWT + WS ≈ 4h  
Tasks Service + audit log + events ≈ 6h  
Notifications Service + real-time ≈ 3.5h  
Frontend (auth, list, detail, real-time, forms) ≈ 7h  
Polimento, validações, toast, skeletons, docs ≈ 3h  

## Como rodar

```bash
docker-compose up --build