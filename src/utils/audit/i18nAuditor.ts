import { hardcodedStringScanner, HardcodedStringIssue } from './hardcodedStringScanner';
import { translationQualityAnalyzer, TranslationIssue, TranslationCoverage } from './translationQualityAnalyzer';
import * as fs from 'fs';
import * as path from 'path';

export interface I18nAuditReport {
  timestamp: Date;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    translationCoverage: number;
    overallScore: number;
  };
  hardcodedStrings: {
    issues: HardcodedStringIssue[];
    summary: any;
  };
  translations: {
    issues: TranslationIssue[];
    coverage: TranslationCoverage;
    recommendations: string[];
  };
  vendorSpecific: {
    componentsCovered: number;
    componentsWithIssues: number;
    criticalComponents: string[];
  };
  actionItems: ActionItem[];
}

export interface ActionItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'hardcoded' | 'translation' | 'rtl' | 'accessibility';
  title: string;
  description: string;
  file?: string;
  line?: number;
  estimatedEffort: 'minutes' | 'hours' | 'days';
  autoFixable: boolean;
}

export class I18nAuditor {
  async runFullAudit(): Promise<I18nAuditReport> {
    console.log('🔍 Starting comprehensive vendor dashboard i18n audit...');
    
    // Run hardcoded string analysis
    console.log('📝 Scanning for hardcoded strings...');
    const hardcodedIssues = await hardcodedStringScanner.scanVendorComponents();
    const hardcodedSummary = hardcodedStringScanner.generateSummary(hardcodedIssues);
    
    // Run translation quality analysis
    console.log('🌍 Analyzing translation quality...');
    const translationAnalysis = translationQualityAnalyzer.analyzeTranslationQuality();
    
    // Generate vendor-specific insights
    console.log('🏪 Analyzing vendor component coverage...');
    const vendorInsights = this.analyzeVendorComponents(hardcodedIssues);
    
    // Calculate overall metrics
    const summary = this.calculateSummaryMetrics(
      hardcodedIssues,
      translationAnalysis.issues,
      translationAnalysis.coverage
    );
    
    // Generate prioritized action items
    const actionItems = this.generateActionItems(
      hardcodedIssues,
      translationAnalysis.issues,
      vendorInsights
    );
    
    const report: I18nAuditReport = {
      timestamp: new Date(),
      summary,
      hardcodedStrings: {
        issues: hardcodedIssues,
        summary: hardcodedSummary
      },
      translations: translationAnalysis,
      vendorSpecific: vendorInsights,
      actionItems
    };
    
    // Save report to file
    await this.saveReport(report);
    
    console.log('✅ Audit completed successfully!');
    return report;
  }

  private analyzeVendorComponents(hardcodedIssues: HardcodedStringIssue[]) {
    const vendorFiles = new Set(hardcodedIssues
      .filter(issue => issue.file.includes('/vendor/'))
      .map(issue => issue.file)
    );
    
    const criticalComponents = Array.from(vendorFiles)
      .filter(file => {
        const fileIssues = hardcodedIssues.filter(issue => 
          issue.file === file && issue.severity === 'high'
        );
        return fileIssues.length > 3; // More than 3 high-severity issues
      });
    
    return {
      componentsCovered: vendorFiles.size,
      componentsWithIssues: vendorFiles.size,
      criticalComponents: criticalComponents.map(file => path.basename(file))
    };
  }

  private calculateSummaryMetrics(
    hardcodedIssues: HardcodedStringIssue[],
    translationIssues: TranslationIssue[],
    coverage: TranslationCoverage
  ) {
    const totalIssues = hardcodedIssues.length + translationIssues.length;
    const criticalIssues = [
      ...hardcodedIssues.filter(i => i.severity === 'high'),
      ...translationIssues.filter(i => i.severity === 'critical' || i.severity === 'high')
    ].length;
    
    // Calculate overall score (0-100)
    const coverageScore = coverage.coveragePercentage;
    const issueScore = Math.max(0, 100 - (criticalIssues * 5) - (totalIssues * 1));
    const overallScore = (coverageScore * 0.6) + (issueScore * 0.4);
    
    return {
      totalIssues,
      criticalIssues,
      translationCoverage: coverage.coveragePercentage,
      overallScore: Math.round(overallScore)
    };
  }

  private generateActionItems(
    hardcodedIssues: HardcodedStringIssue[],
    translationIssues: TranslationIssue[],
    vendorInsights: any
  ): ActionItem[] {
    const actions: ActionItem[] = [];
    
    // Critical hardcoded strings
    hardcodedIssues
      .filter(issue => issue.severity === 'high')
      .slice(0, 10) // Top 10 most critical
      .forEach((issue, index) => {
        actions.push({
          id: `hardcoded-${index}`,
          priority: 'critical',
          category: 'hardcoded',
          title: `Replace hardcoded text: "${issue.text}"`,
          description: `Found in ${path.basename(issue.file)} at line ${issue.line}. Replace with t() function call.`,
          file: issue.file,
          line: issue.line,
          estimatedEffort: 'minutes',
          autoFixable: true
        });
      });
    
    // Missing translations
    translationIssues
      .filter(issue => issue.type === 'missing' && issue.severity === 'critical')
      .slice(0, 5)
      .forEach((issue, index) => {
        actions.push({
          id: `translation-${index}`,
          priority: 'high',
          category: 'translation',
          title: `Add missing translation: ${issue.key}`,
          description: `Missing Arabic translation for "${issue.enValue}". ${issue.suggestion}`,
          estimatedEffort: 'minutes',
          autoFixable: false
        });
      });
    
    // Critical vendor components
    vendorInsights.criticalComponents.slice(0, 3).forEach((component: string, index: number) => {
      actions.push({
        id: `vendor-${index}`,
        priority: 'high',
        category: 'hardcoded',
        title: `Fix critical vendor component: ${component}`,
        description: `This component has multiple hardcoded strings that need translation.`,
        file: `src/components/vendor/${component}`,
        estimatedEffort: 'hours',
        autoFixable: false
      });
    });
    
    // RTL issues
    translationIssues
      .filter(issue => issue.type === 'rtl')
      .slice(0, 3)
      .forEach((issue, index) => {
        actions.push({
          id: `rtl-${index}`,
          priority: 'medium',
          category: 'rtl',
          title: `Fix RTL issue: ${issue.key}`,
          description: issue.description,
          estimatedEffort: 'minutes',
          autoFixable: false
        });
      });
    
    return actions.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private async saveReport(report: I18nAuditReport): Promise<void> {
    const reportsDir = 'reports/i18n';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const timestamp = report.timestamp.toISOString().split('T')[0];
    const filename = `vendor-i18n-audit-${timestamp}.json`;
    const filepath = path.join(reportsDir, filename);
    
    // Save detailed JSON report
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));
    
    // Generate human-readable summary
    const summary = this.generateHumanReadableSummary(report);
    const summaryPath = path.join(reportsDir, `vendor-i18n-summary-${timestamp}.md`);
    fs.writeFileSync(summaryPath, summary);
    
    console.log(`📊 Report saved to: ${filepath}`);
    console.log(`📝 Summary saved to: ${summaryPath}`);
  }

  private generateHumanReadableSummary(report: I18nAuditReport): string {
    return `# Vendor Dashboard I18n Audit Report

**Generated:** ${report.timestamp.toISOString()}
**Overall Score:** ${report.summary.overallScore}/100

## 📊 Summary

- **Total Issues:** ${report.summary.totalIssues}
- **Critical Issues:** ${report.summary.criticalIssues}
- **Translation Coverage:** ${report.summary.translationCoverage.toFixed(1)}%
- **Vendor Components:** ${report.vendorSpecific.componentsCovered}

## 🚨 Critical Action Items (Top 5)

${report.actionItems.slice(0, 5).map((item, i) => 
  `${i + 1}. **${item.title}** (${item.priority})\n   ${item.description}\n`
).join('\n')}

## 📝 Hardcoded Strings

- **Total Found:** ${report.hardcodedStrings.issues.length}
- **High Severity:** ${report.hardcodedStrings.issues.filter(i => i.severity === 'high').length}
- **Medium Severity:** ${report.hardcodedStrings.issues.filter(i => i.severity === 'medium').length}

### Top Issues by File:
${Object.entries(report.hardcodedStrings.summary.byFile)
  .sort(([,a], [,b]) => (b as number) - (a as number))
  .slice(0, 5)
  .map(([file, count]) => `- ${file.split('/').pop()}: ${count} issues`)
  .join('\n')}

## 🌍 Translation Quality

- **Missing Keys:** ${report.translations.coverage.missingKeys.length}
- **Empty Translations:** ${report.translations.coverage.emptyKeys.length}
- **Critical Issues:** ${report.translations.issues.filter(i => i.severity === 'critical').length}

### Recommendations:
${report.translations.recommendations.map(rec => `- ${rec}`).join('\n')}

## 🏪 Vendor Components Analysis

- **Components with Issues:** ${report.vendorSpecific.componentsWithIssues}
- **Critical Components:** ${report.vendorSpecific.criticalComponents.join(', ')}

## 🎯 Next Steps

1. **Immediate (Critical):** Fix ${report.actionItems.filter(a => a.priority === 'critical').length} critical hardcoded strings
2. **This Week (High):** Address ${report.actionItems.filter(a => a.priority === 'high').length} high-priority translation issues  
3. **This Sprint (Medium):** Improve translation coverage to 95%+
4. **Ongoing (Low):** Set up prevention measures and monitoring

---
*Generated by Lovable I18n Auditor*
`;
  }

  // Method to generate CI-friendly output
  generateCIReport(report: I18nAuditReport): string {
    const criticalCount = report.actionItems.filter(a => a.priority === 'critical').length;
    const highCount = report.actionItems.filter(a => a.priority === 'high').length;
    
    return `::set-output name=i18n-score::${report.summary.overallScore}
::set-output name=critical-issues::${criticalCount}
::set-output name=high-issues::${highCount}
::set-output name=coverage::${report.summary.translationCoverage.toFixed(1)}
${criticalCount > 0 ? '::error::Critical i18n issues found that must be fixed' : ''}
${report.summary.overallScore < 80 ? '::warning::I18n score below 80, improvements needed' : ''}`;
  }
}

export const i18nAuditor = new I18nAuditor();