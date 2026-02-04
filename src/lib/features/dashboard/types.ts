//src/lib/features/dashboard/types.ts

// API Response Types (matching backend DTOs)
export interface CompanyStatisticsResponse {
    generatedDocuments: number;
    completeProfilePercentage: number;
    consortiaCompanies: number;
}