import { Routes } from '@angular/router';
import { AuthGuard } from '@core/security/auth.guard';
import { AppComponent } from './app.component';
import { CompanyProfileResolver } from './company-profile/company-profile.resolver';
import { LayoutComponent } from './core/layout/layout.component';
import { MyProfileComponent } from './user/my-profile/my-profile.component';

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    resolve: { profile: CompanyProfileResolver },
    children: [{
      path: 'login',
      loadChildren: () =>
        import('./login/login-routing.module').then(m => m.routes)
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
            import('./dashboard/dashboard-routing.module').then(m => m.routes)
        }, {
          path: 'actions',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./action/action-routing.module').then(m => m.routes)
        }, {
          path: 'pages',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./page/page-routing.module').then(m => m.routes)
        }, {
          path: 'page-action',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./page-action/page-action-routing.module').then(m => m.routes)
        },
        {
          path: 'roles',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./role/role-routing.module').then(m => m.routes)
        }, {
          path: 'users',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./user/user-routing.module').then(m => m.routes)
        }, {
          path: 'login-audit',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./login-audit/login-audit-routing.module').then(m => m.routes)
        },
        {
          path: 'sessions',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./session/session-routing.module').then(m => m.routes)
        },
        {
          path: 'emailtemplate',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-template/email-template-routing.module').then(m => m.routes)
        },
        {
          path: 'send-email',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-send/email-send-routing.module').then(m => m.routes)
        },
        {
          path: 'logs',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./n-log/n-log-routing.module').then(m => m.routes)
        },
        {
          path: 'email-smtp',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./email-smtp-setting/email-smtp-setting-routing.module').then(m => m.routes)
        },
        {
          path: 'supplier',
          loadChildren: () =>
            import('./supplier/supplier-routing.module').then(m => m.routes)
        }, {
          path: 'chemical',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./chemical/chemical-routing.module').then(m => m.routes)
        },
        {
          path: 'inquiry',
          loadChildren: () =>
            import('./inquiry/inquiry-routing.module').then(m => m.routes)
        }, {
          path: 'supplier-chemical-relationship',
          loadChildren: () =>
            import('./supplier-chemical/supplier-chemical-routing.module').then(m => m.routes)
        }, {
          path: 'industry',
          loadChildren: () =>
            import('./industry/industry-routing.module').then(m => m.routes)
        }, {
          path: 'industry-chemical',
          loadChildren: () =>
            import('./industry-chemical/industry-chemical-routing.module').then(m => m.routes)
        }, {
          path: 'search',
          loadChildren: () =>
            import('./search-chemical-supplier/search-chemical-supplier-routing.module').then(m => m.routes)
        }, {
          path: 'article',
          loadChildren: () =>
            import('./article/article-routing.module').then(m => m.routes)
        }, {
          path: 'testimonial',
          loadChildren: () =>
            import('./testimonial/testimonial-routing.module').then(m => m.routes)
        }, {
          path: 'gallery',
          loadChildren: () =>
            import('./gallery/gallery-routing.module').then(m => m.routes)
        },
        {
          path: 'customer',
          loadChildren: () =>
            import('./customer/customer-routing.module').then(m => m.routes)
        },
        {
          path: 'customer-chemical-relationship',
          loadChildren: () =>
            import('./customer-chemical/customer-chemical-routing.module').then(m => m.routes)
        },
        {
          path: 'contact-us',
          loadChildren: () =>
            import('./contact-us/contact-us-routing.module').then(m => m.routes)
        },
        {
          path: 'chemical-types',
          loadChildren: () =>
            import('./chemical-type/chemical-type-routing.module').then(m => m.routes)
        },
        {
          path: 'my-documents',
          loadChildren: () =>
            import('./document-library/document-library-routing.module').then(m => m.routes)
        },
        {
          path: 'document-categories',
          loadChildren: () =>
            import('./document-category/document-category-routing.module').then(m => m.routes)
        },
        {
          path: 'documents',
          loadChildren: () =>
            import('./document/document-routing.module').then(m => m.routes)
        },
        {
          path: 'document-audit-trails',
          loadChildren: () =>
            import('./document-audit-trail/document-audit-trail-routing.module').then(m => m.routes)
        },
        {
          path: 'notifications',
          loadChildren: () =>
            import('./notification/notification-routing.module').then(m => m.routes)
        },
        {
          path: 'reminders',
          loadChildren: () => import('./reminder/reminder-routing.module').then(m => m.routes)
        }, {
          path: 'purchase-order-request',
          loadChildren: () => import('./purchase-order-request/purchase-order-request-routing.module').then(m => m.routes)
        },
        {
          path: 'purchase-order',
          loadChildren: () => import('./purchase-order/purchase-order-routing.module').then(m => m.routes)
        }, {
          path: 'sales-order',
          loadChildren: () => import('./sales-order/sales-order-routing.module').then(m => m.routes)
        }, {
          path: 'sales-order-return',
          loadChildren: () => import('./sales-order-return/sales-order-return-routing.module').then(m => m.routes)
        }, {
          path: 'delivery-method',
          loadChildren: () => import('./delivery-method/delivery-method-routing.module').then(m => m.routes)
        }, {
          path: 'packaging-type',
          loadChildren: () => import('./packaging-type/packaging-type-routing.module').then(m => m.routes)
        }, {
          path: 'inquiry-status',
          loadChildren: () => import('./inquiry-status/inquiry-status-routing.module').then(m => m.routes)
        }, {
          path: 'inquiry-source',
          loadChildren: () => import('./inquiry-source/inquiry-source-routing.module').then(m => m.routes)
        },
        {
          path: 'payment-term',
          loadChildren: () => import('./payment-term/payment-term-routing.module').then(m => m.routes)
        },
        {
          path: 'inventory',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./inventory/inventory-routing.module').then(m => m.routes)
        }, {
          path: 'company-profile',
          canLoad: [AuthGuard],
          loadChildren: () =>
            import('./company-profile/company-profile-routing.module').then(m => m.routes)
        },
        {
          path: 'expense-category',
          loadChildren: () => import('./expense-category/expense-category-routing.module').then(m => m.routes)
        },
        {
          path: 'expense',
          loadChildren: () => import('./expense/expense-routing.module').then(m => m.routes)
        }, {
          path: 'unit',
          loadChildren: () =>
            import('./unit/unit-routing.module').then(m => m.routes)
        }, {
          path: 'tax',
          loadChildren: () =>
            import('./tax/tax-routing.module').then(m => m.routes)
        },
        {
          path: 'purchase-order-return',
          loadChildren: () => import('./purchase-order-return/purchase-order-return-routing.module').then(m => m.routes)
        }, {
          path: 'expense-report',
          loadChildren: () =>
            import('./reports/expense-report/expense-report-routing.module').then(m => m.routes)
        }, {
          path: 'purchase-payment-report',
          loadChildren: () =>
            import('./reports/purchase-payment-report/purchase-payment-report-routing.module').then(m => m.routes)
        }, {
          path: 'sales-payment-report',
          loadChildren: () =>
            import('./reports/sales-payment-report/sales-payment-report-routing.module').then(m => m.routes)
        }, {
          path: 'stock-report',
          loadChildren: () =>
            import('./reports/stock-report/stock-report-routing.module').then(m => m.routes)
        }, {
          path: 'chemical-purchase-report',
          loadChildren: () =>
            import('./reports/chemical-purchase-report/chemical-purchase-report-routing.module').then(m => m.routes)
        }, {
          path: 'chemical-sales-report',
          loadChildren: () =>
            import('./reports/chemical-sales-report/chemical-sales-report-routing.module').then(m => m.routes)
        }, {
          path: 'purchase-order-report',
          loadChildren: () =>
            import('./reports/purchase-order-report/purchase-order-report-routing.module').then(m => m.routes)
        },{
          path: 'sales-order-report',
          loadChildren: () =>
            import('./reports/sales-order-report/sales-order-report-routing.module').then(m => m.routes)
        },{
          path: 'sales-purchase-report',
          loadChildren: () =>
            import('./reports/sales-purchase-report/sales-purchase-routing.module').then(m => m.routes)
        },
        {
          path: '**',
          redirectTo: '/'
        }

      ]
    }]
  }
];
