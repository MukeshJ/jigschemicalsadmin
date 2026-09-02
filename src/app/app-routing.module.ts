import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { AppComponent } from './app.component';
import { CompanyProfileResolver } from './company-profile/company-profile.resolver';
import { LayoutComponent } from './core/layout/layout.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: { profile: CompanyProfileResolver },
    children: [{
      path: 'login',
      loadChildren: () =>
        import('./login/login.module')
          .then(m => m.LoginModule)
    }, {
      path: '',
      component: LayoutComponent,
      children: [
        {
          path: 'my-profile',
          component: MyProfileComponent,
          canActivate: [AuthGuard],
        }, {
          path: '',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./dashboard/dashboard.module')
              .then(m => m.DashboardModule)
        }, {
          path: 'actions',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./action/action.module')
              .then(m => m.ActionModule)
        }, {
          path: 'pages',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./page/page.module')
              .then(m => m.PageModule)
        }, {
          path: 'page-action',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./page-action/page-action.module')
              .then(m => m.PageActionModule)
        },
        {
          path: 'roles',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./role/role.module')
              .then(m => m.RoleModule)
        }, {
          path: 'users',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./user/user.module')
              .then(m => m.UserModule)
        }, {
          path: 'login-audit',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./login-audit/login-audit.module')
              .then(m => m.LoginAuditModule)
        },
        {
          path: 'sessions',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./session/session.module')
              .then(m => m.SessionModule)
        },
        {
          path: 'emailtemplate',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-template/email-template.module')
              .then(m => m.EmailTemplateModule)
        },
        {
          path: 'send-email',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-send/email-send.module')
              .then(m => m.EmailSendModule)
        },
        {
          path: 'logs',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./n-log/n-log.module')
              .then(m => m.NLogModule)
        },
        {
          path: 'email-smtp',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-smtp-setting/email-smtp-setting.module')
              .then(m => m.EmailSmtpSettingModule)
        },
        {
          path: 'supplier',
          loadChildren: () =>
            import('./supplier/supplier.module').then(
              m => m.SupplierModule
            )
        }, {
          path: 'chemical',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./chemical/chemical.module')
              .then(m => m.ChemicalModule)
        },
        {
          path: 'inquiry',
          loadChildren: () =>
            import('./inquiry/inquiry.module').then(
              m => m.InquiryModule
            )
        }, {
          path: 'supplier-chemical-relationship',
          loadChildren: () =>
            import('./supplier-chemical/supplier-chemical.module').then(
              m => m.SupplierChemicalModule
            )
        }, {
          path: 'industry',
          loadChildren: () =>
            import('./industry/industry.module').then(
              m => m.IndustryModule
            )
        }, {
          path: 'industry-chemical',
          loadChildren: () =>
            import('./industry-chemical/industry-chemical.module').then(
              m => m.IndustryChemicalModule
            )
        }, {
          path: 'search',
          loadChildren: () =>
            import('./search-chemical-supplier/search-chemical-supplier.module').then(
              m => m.SearchChemicalSupplierModule
            )
        }, {
          path: 'article',
          loadChildren: () =>
            import('./article/article.module').then(
              m => m.ArticleModule
            )
        }, {
          path: 'testimonial',
          loadChildren: () =>
            import('./testimonial/testimonial.module').then(
              m => m.TestimonialModule
            )
        }, {
          path: 'gallery',
          loadChildren: () =>
            import('./gallery/gallery.module').then(
              m => m.GalleryModule
            )
        },
        {
          path: 'customer',
          loadChildren: () =>
            import('./customer/customer.module').then(
              m => m.CustomerModule
            )
        },
        {
          path: 'customer-chemical-relationship',
          loadChildren: () =>
            import('./customer-chemical/customer-chemical.module').then(
              m => m.CustomerChemicalModule
            )
        },
        {
          path: 'contact-us',
          loadChildren: () =>
            import('./contact-us/contact-us.module').then(
              m => m.ContactUsModule
            )
        },
        {
          path: 'chemical-types',
          loadChildren: () =>
            import('./chemical-type/chemical-type.module').then(
              m => m.ChemicalTypeModule
            )
        },
        {
          path: 'my-documents',
          loadChildren: () =>
            import('./document-library/document-library.module')
              .then(m => m.DocumentLibraryModule)
        },
        {
          path: 'document-categories',
          loadChildren: () =>
            import('./document-category/document-category.module')
              .then(m => m.DocumentCategoryModule)
        },
        {
          path: 'documents',
          loadChildren: () =>
            import('./document/document.module')
              .then(m => m.DocumentModule)
        },
        {
          path: 'document-audit-trails',
          loadChildren: () =>
            import('./document-audit-trail/document-audit-trail.module')
              .then(m => m.DocumentAuditTrailModule)
        },
        {
          path: 'notifications',
          loadChildren: () =>
            import('./notification/notification.module')
              .then(m => m.NotificationModule)
        },
        {
          path: 'reminders',
          loadChildren: () => import('./reminder/reminder.module')
            .then(m => m.ReminderModule)
        }, {
          path: 'purchase-order-request',
          loadChildren: () => import('./purchase-order-request/purchase-order-request.module')
            .then(m => m.PurchaseOrderRequestModule)
        },
        {
          path: 'purchase-order',
          loadChildren: () => import('./purchase-order/purchase-order.module')
            .then(m => m.PurchaseOrderModule)
        }, {
          path: 'sales-order',
          loadChildren: () => import('./sales-order/sales-order.module')
            .then(m => m.SalesOrderModule)
        }, {
          path: 'sales-order-return',
          loadChildren: () => import('./sales-order-return/sales-order-return.module')
            .then(m => m.SaleOrderReturnModule)
        }, {
          path: 'delivery-method',
          loadChildren: () => import('./delivery-method/delivery-method.module')
            .then(m => m.DeliveryMethodModule)
        }, {
          path: 'packaging-type',
          loadChildren: () => import('./packaging-type/packaging-type.module')
            .then(m => m.PackagingTypeModule)
        }, {
          path: 'inquiry-status',
          loadChildren: () => import('./inquiry-status/inquiry-status.module')
            .then(m => m.InquiryStatusModule)
        }, {
          path: 'inquiry-source',
          loadChildren: () => import('./inquiry-source/inquiry-source.module')
            .then(m => m.InquirySourceModule)
        },
        {
          path: 'payment-term',
          loadChildren: () => import('./payment-term/payment-term.module')
            .then(m => m.PaymentTermModule)
        },
        {
          path: 'inventory',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./inventory/inventory.module')
              .then(m => m.InventoryModule)
        }, {
          path: 'company-profile',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./company-profile/company-profile.module')
              .then(m => m.CompanyProfileModule)
        },
        {
          path: 'expense-category',
          loadChildren: () => import('./expense-category/expense-category.module')
            .then(m => m.ExpenseCategoryModule)
        },
        {
          path: 'expense',
          loadChildren: () => import('./expense/expense.module')
            .then(m => m.ExpenseModule)
        }, {
          path: 'unit',
          loadChildren: () =>
            import('./unit/unit.module').then(
              m => m.UnitModule
            )
        }, {
          path: 'tax',
          loadChildren: () =>
            import('./tax/tax.module').then(
              m => m.TaxModule
            )
        },
        {
          path: 'purchase-order-return',
          loadChildren: () => import('./purchase-order-return/purchase-order-return.module')
            .then(m => m.PurchaseOrderReturnModule)
        }, {
          path: 'expense-report',
          loadChildren: () =>
            import('./reports/expense-report/expense-report.module').then(
              m => m.ExpenseReportModule
            )
        }, {
          path: 'purchase-payment-report',
          loadChildren: () =>
            import('./reports/purchase-payment-report/purchase-payment-report.module').then(
              m => m.PurchasePaymentReportModule
            )
        }, {
          path: 'sales-payment-report',
          loadChildren: () =>
            import('./reports/sales-payment-report/sales-payment-report.module').then(
              m => m.SalesPaymentReportModule
            )
        }, {
          path: 'stock-report',
          loadChildren: () =>
            import('./reports/stock-report/stock-report.module').then(
              m => m.StockReportModule
            )
        }, {
          path: 'chemical-purchase-report',
          loadChildren: () =>
            import('./reports/chemical-purchase-report/chemical-purchase-report.module').then(
              m => m.ChemicalPurchaseReportModule
            )
        }, {
          path: 'chemical-sales-report',
          loadChildren: () =>
            import('./reports/chemical-sales-report/chemical-sales-report.module').then(
              m => m.ChemicalSalesReportModule
            )
        }, {
          path: 'purchase-order-report',
          loadChildren: () =>
            import('./reports/purchase-order-report/purchase-order-report.module').then(
              m => m.PurchaseOrderReportModule
            )
        },{
          path: 'sales-order-report',
          loadChildren: () =>
            import('./reports/sales-order-report/sales-order-report.module').then(
              m => m.SalesOrderReportModule
            )
        },{
          path: 'sales-purchase-report',
          loadChildren: () =>
            import('./reports/sales-purchase-report/sales-purchase-report.module').then(
              m => m.SalesPurchaseReportModule
            )
        },
        {
          path: '**',
          redirectTo: '/'
        }

      ]
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
