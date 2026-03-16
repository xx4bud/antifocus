# Antifocus ERP — Print on Demand
## Prisma Schema Documentation

---

## Struktur File

| File | Module | Deskripsi |
|------|--------|-----------|
| `schema.prisma` | Root | Datasource & generator config |
| `identity.prisma` | Identity | Auth, User, Organization, Member, Sequence |
| `directory.prisma` | Directory | Profile, Address, Branch, Customer, Supplier, Locale |
| `catalog.prisma` | Catalog | Product, Variant, Price, Attribute, Unit |
| `asset.prisma` | Asset | Storage, DesignArea, DesignAsset |
| `grouping.prisma` | Grouping | Category, Collection, Tag |
| `commerce.prisma` | Commerce | Cart, Order, Return, Promotion, Banner |
| `finance.prisma` | Finance | CoA, AccountMove, Payment, Tax, Currency |
| `supply_chain.prisma` | Supply Chain | Stock, BOM, JobOrder, QC, PurchaseOrder |
| `logistic.prisma` | Logistic | Shipping, Shipment, Tracking |
| `support.prisma` | Support | Ticket, Notification, Review, Channel |
| `project.prisma` | Project | Project, Task, Stage, Timesheet |
| `integration.prisma` | Integration | Marketplace sync, Webhook |
| `automation.prisma` | Automation | Workflow, Automation Rule, Cron |
| `data.prisma` | Data | Report, Export, Import, Backup |

---

## Perubahan & Perbaikan dari Versi Sebelumnya

### 🆕 Fitur Baru Ditambahkan

#### Identity
- `Member.branchId` — member bisa di-assign ke branch tertentu (penting untuk multi-outlet PoD)
- `Sequence` sekarang mendukung `AccountMove` dan `Order` (bukan hanya StockPicking)
- Rename `actor` → `actorName` di AuditLog (lebih eksplisit)
- `UserRole.description` dan `OrganizationRole.description` untuk dokumentasi role

#### Directory
- `Branch.type` enum (`office | store | warehouse | workshop`) menggantikan `categoryId` — lebih clean untuk PoD
- `Customer.customerGroupId` untuk segmentasi pricing
- `Customer.loyaltyPoints`, `totalSpend`, `totalOrders` — CRM dasar
- `Supplier.bomSupplierItems` — supplier bisa di-link ke komponen BoM
- `Village.zipCode` — kode pos langsung di level kelurahan
- Presisi koordinat diperbaiki: `longitude Decimal(11,8)`, `latitude Decimal(10,8)`
- Rename `Address.default` → `Address.isDefault` (konsistensi)

#### Catalog
- `Product.requiresDesign` flag — menandai produk yang perlu file desain dari customer
- `Product.description @db.Text` — support teks panjang
- Rename field kalkulasi harga: `taxRatePrice` → `taxAmount`, `shippingRateAmount` → `shippingAmount`
- `Price.minOrderAmt/maxOrderAmt` rename dari `minOrderAmount/maxOrderAmount` (konsistensi)
- `Unit.ratio` default diubah dari `0` ke `1` (logika lebih benar)

#### Asset
- `StorageProvider` enum menggantikan `StorageType` dengan nilai lebih spesifik (`cloudflare_r2`, `aws_s3`)
- `Asset.width` dan `Asset.height` dibuat opsional (untuk file non-gambar)
- `DesignArea.printCost` — biaya cetak per area
- `DesignArea.code` ditambahkan + unique constraint per produk/variant
- `DesignAsset.validationMessage` — pesan error validasi teknis
- `DesignArea.enabled` flag

#### Grouping
- `Category.position` untuk pengurutan
- `ProductCategory.position` untuk urutan di kategori
- `CollectionProduct.position` untuk urutan di koleksi
- Rename `ProductTag` → `TagProduct` (konsistensi nama junction table)

#### Commerce
- Simplifikasi `OrderStatus`: dihapus `sent`, `checkout`, `received`, `billed` yang redundant
- Rename `PaymentState.state` → `paymentState` di Order
- Rename `total` → `grandTotal` di Cart dan Order (lebih eksplisit)
- Rename `subTotal` → `lineTotal` di CartItem dan OrderItem
- Ditambahkan `Order.productionNote` dan `Order.customerNote` — penting untuk PoD
- `CartItem.designAssetId` — pre-link desain saat add to cart
- `PromotionType.fixed` → `fixed_amount` (lebih deskriptif)
- `PromotionStatus.used_up` → `depleted`
- `Promotion.rules` JSON untuk eligibilitas yang fleksibel
- `Banner.position` dan `Banner.enabled`
- `OrderItem.product` onDelete diubah dari `Cascade` ke `Restrict` (aman untuk audit trail)

#### Finance
- `MoveType` lebih deskriptif: `invoice` → `sale_invoice`, `bill` → `purchase_bill`
- `Currency.isDefault` flag
- `CurrencyRate.rateDate` untuk histori kurs
- `TaxRate.type` diubah dari enum `PricingType` ke `String` (lebih fleksibel)
- `PaymentMethod.provider` field untuk payment gateway
- `Payment.externalRef` untuk referensi payment gateway
- `Payment.paymentMethodId` FK ke `PaymentMethod` (sebelumnya hanya `paymentMethod: String`)
- `AccountMoveItem.balance` computed field
- Sequence integration di `AccountMove`

#### Supply Chain
- `Stock.quantity` diubah ke `Decimal` (untuk produk yang bisa satuan desimal, e.g. bahan baku)
- `Stock.reorderQty`, `avgCost`, `totalValue` untuk manajemen nilai stok
- `StockMove.unitCost` dan `totalCost` untuk perhitungan COGS
- `BomItem.supplierId` — default supplier per komponen
- `JobOrder.printMachine`, `printOperator`, `printFilePath` — PoD spesifik
- `JobOrderStatus` ditambah `qc_pending` (sebelumnya hanya `qc_pass` dan `qc_fail`)
- `JobOrder.priority` index ditambahkan
- `QualityCheck.criteria` JSON untuk list kriteria
- Rename `WorkOrder.durationExpected/Actual` → `durationEstimate/Actual` (lebih natural)
- `PurchaseOrderItem.quantity` diubah ke `Decimal`
- `PickingType.return` ditambahkan

#### Logistic
- `ShipmentStatus.failed_attempt` dan `returned_to_sender` ditambahkan
- `ShippingRate.freeShippingMinOrder` — threshold free ongkir
- `Shipment.estimatedDelivery` dan `deliveredAt`
- Rename `senderAddress/recipientAddress` JSON → `senderSnapshot/recipientSnapshot` (lebih eksplisit)
- `ShipmentTracking.source` untuk membedakan tracking otomatis vs manual
- `ShippingMethod.logo` dan `enabled` flag

#### Support
- `Ticket.subject` menggantikan `name` (lebih domain-appropriate)
- `Ticket.assigneeId` untuk assign ke member
- `Ticket.resModel` dan `resId` — link ke entity terkait (Order, Shipment, dll)
- `TicketStatus` direstruktur: `draft` dihapus, ditambah `waiting_customer`
- `TicketMessage.isInternal` → `isInternal` (rename dari `internal`)
- `Notification.status` nilai `pending` → `unread` (lebih deskriptif)
- `Notification.pushSent` dan `pushedAt` untuk push notification tracking
- `Review.adminReply` menggantikan `reply` (lebih eksplisit)
- `ChannelMessage.parentId` untuk thread/reply
- `ChannelMessage.editedAt` dan `deletedAt`

#### Project
- `ProjectStage` dipisah menjadi model tersendiri (sebelumnya hanya `stageId: String` di ProjectTask)
- `TaskStatus` enum ditambahkan (sebelumnya tidak ada)
- `KanbanState` enum formal (sebelumnya hanya `kanbanState: String?`)
- `Project.estimatedHours` untuk estimasi jam produksi

#### Integration
- `Integration.syncProducts/Orders/Stock/Prices` boolean flags
- `IntegrationItem.externalSku` field
- `IntegrationItem` unique constraint diubah ke `[integrationId, productId, variantId]`
- `IntegrationOrder.buyerEmail`, `discount`, `rawPayload`, `internalOrderId`
- `IntegrationOrderItem.discount` field
- `IntegrationLog.recordsFailed` ditambahkan
- `WebhookLog.httpStatus` menggantikan `status: Int`, ditambah `attempts` dan `nextRetryAt`
- `Webhook.retryCount` konfigurasi

#### Automation
- `AutomationTrigger.on_status_change` ditambahkan
- `AutomationActionType.send_push_notification` dan `assign_task`
- `WorkflowTransition.sideEffects` menggantikan `actionToRun`
- `WorkflowHistory.fromStateCode/toStateCode` snapshot untuk audit
- `WorkflowTemplate` unique constraint per `[organizationId, targetModel]`
- `AutomationRule.priority` untuk urutan eksekusi
- `ActionLog.result` untuk menyimpan output eksekusi

#### Data
- `ReportFormat.json` ditambahkan
- `ReportDeliveryMethod.sftp` ditambahkan
- `SavedReport.groupBy` field
- `ImportAction.upsert` menggantikan `create_or_update`
- `DataImportJob.failedRows` menggantikan `errorRows` + `errorDetail` JSON
- `DatabaseBackup.checksum` untuk validasi integritas file

---

### 🗑️ Over-Engineering Dihapus / Disederhanakan

- `OrderType` enum (`sale | purchase`) dihapus — `PurchaseOrder` sudah terpisah
- `BranchStatus.vacation/maintenance` dipertahankan tapi `categoryId` di Branch dihapus (ganti jadi enum `BranchType`)
- `MoveItemStatus` enum dihapus — tidak digunakan secara konsisten
- `Sequence.stockPicking` relasi one-to-one diganti ke one-to-many (lebih fleksibel)
- `Profile.organizationId @unique` dipertahankan karena memang 1:1
- `DefaultUserRole` dan `DefaultOrgRole` enum dihapus (redundant dengan `UserRole.role` string)

---

### 🔧 Perbaikan Teknis

- Semua field `total` di Cart/Order distandarkan: `subTotal`, `discountTotal`, `taxTotal`, `shippingTotal`, `grandTotal`
- Field `default` di berbagai model distandarkan ke `isDefault` untuk konsistensi
- `@db.Text` ditambahkan ke semua field string panjang (`description`, `note`, `body`, `content`)
- Index komposit ditambahkan untuk query paling umum
- `onDelete: Cascade` vs `Restrict` vs `SetNull` di-review ulang untuk data integrity
- Konvensi nama relasi distandarkan: `"entity_relations"` (snake_case)

---

## Alur Bisnis Utama (PoD)

```
Customer Upload Desain
  └─> DesignAsset (draft)
        └─> Review oleh Operator
              └─> DesignAsset (approved)
                    └─> Order dibuat
                          └─> JobOrder (print_queue)
                                └─> WorkOrder (printing → QC)
                                      └─> QualityCheck (pass/fail)
                                            └─> Shipment (picked_up → delivered)
```

---

## Catatan Penggunaan

### Multi-tenancy
Semua model bisnis memiliki `organizationId`. Selalu filter berdasarkan `organizationId` di setiap query untuk isolasi data antar tenant.

### Soft Delete
Model dengan `deletedAt DateTime?` menggunakan soft delete. Gunakan middleware Prisma atau filter `{ deletedAt: null }` di setiap query.

### Snapshot Fields
`OrderItem` memiliki `snapshotProductName`, `snapshotVariantName`, `snapshotSku` untuk memastikan data order tidak berubah walau master produk diupdate.

### Audit Trail
- `AuditLog` untuk perubahan umum per entity
- `OrderStatusHistory` untuk transisi status order
- `DesignStatusHistory` untuk transisi status desain
- `FinancialAuditLog` untuk perubahan jurnal keuangan

### PoD-Specific
- `Product.requiresDesign` — flag produk yang butuh desain dari customer
- `DesignArea` — mendefinisikan zona cetak per produk/variant
- `DesignAsset` — file desain yang diupload customer, linked ke `OrderItem`
- `JobOrder` — work order produksi dengan status granular khusus PoD
- `Order.productionNote` / `customerNote` — instruksi produksi
