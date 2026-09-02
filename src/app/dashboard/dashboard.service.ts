import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonError } from '@core/error-handler/common-error';
import { CommonHttpErrorService } from '@core/error-handler/common-http-error.service';
import { catchError } from 'rxjs/operators';
import { DashboardStaticatics } from '@core/domain-classes/dashboard-staticatics';
import { CalenderReminderDto } from '@core/domain-classes/calender-reminder';
import { MonthlyInquiry } from '@core/domain-classes/monthly-inquiry';
import { SalesOrderRecentShipmentDate } from '@core/domain-classes/sales-order-recent-shipment-date';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(private httpClient: HttpClient,
    private commonHttpErrorService: CommonHttpErrorService) { }

  getDashboardStaticatics(): Observable<DashboardStaticatics | CommonError> {
    const url = `dashboard/statistics`;
    return this.httpClient.get<DashboardStaticatics>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getDailyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/dailyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getWeeklyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/weeklyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMonthlyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/monthlyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getQuarterlyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/quarterlyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getHalfYearlyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/halfyearlyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getYearlyReminders(month, year): Observable<CalenderReminderDto[] | CommonError> {
    const url = `dashboard/yearlyreminder/${month}/${year}`;
    return this.httpClient.get<CalenderReminderDto[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }

  getMonthlyInquiryStatistic(month: number, year: number): Observable<MonthlyInquiry[] | CommonError> {
    const url = `dashboard/monthlyinquiry/${month}/${year}`;
    return this.httpClient.get<MonthlyInquiry[]>(url)
      .pipe(catchError(this.commonHttpErrorService.handleError));
  }
}
