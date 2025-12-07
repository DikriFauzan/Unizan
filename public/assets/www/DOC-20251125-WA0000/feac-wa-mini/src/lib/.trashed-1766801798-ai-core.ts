import { PrismaClient } from '@prisma/client'
import * as ts from 'typescript'

const prisma = new PrismaClient()

export interface CodeIssue {
  filePath: string
  line: number
  column: number
  severity: 'error' | 'warning' | 'info'
  message: string
  rule?: string
  fix?: string
}

export interface AnalysisResult {
  filePath: string
  issues: CodeIssue[]
  complexity: number
  qualityScore: number
  language: string
}

export class AICore {
  private codePatterns: Map<string, any[]> = new Map()
  private fixStrategies: Map<string, Function> = new Map()

  constructor() {
    this.initializePatterns()
    this.initializeFixStrategies()
  }

  async analyzeFile(filePath: string, content: string): Promise<AnalysisResult> {
    const issues: CodeIssue[] = []
    const language = this.detectLanguage(filePath)
    
    // Analyze based on language
    switch (language) {
      case 'typescript':
      case 'javascript':
        issues.push(...this.analyzeJavaScript(content, filePath))
        break
      case 'gdscript':
        issues.push(...this.analyzeGDScript(content, filePath))
        break
      case 'csharp':
        issues.push(...this.analyzeCSharp(content, filePath))
        break
      case 'python':
        issues.push(...this.analyzePython(content, filePath))
        break
    }

    // Calculate metrics
    const complexity = this.calculateCyclomaticComplexity(content, language)
    const qualityScore = this.calculateQualityScore(issues, complexity)

    // Save analysis result
    await prisma.codeAnalysis.create({
      data: {
        filePath,
        language,
        issues: issues as any,
        complexity,
        qualityScore
      }
    })

    return {
      filePath,
      issues,
      complexity,
      qualityScore,
      language
    }
  }

  async autoFix(filePath: string, issues: CodeIssue[]): Promise<string> {
    let content = await this.readFile(filePath)
    const fixes: string[] = []

    for (const issue of issues) {
      if (issue.fix) {
        const fixStrategy = this.fixStrategies.get(issue.rule || issue.message)
        if (fixStrategy) {
          try {
            content = await fixStrategy(content, issue)
            fixes.push(`Fixed: ${issue.message} at line ${issue.line}`)
          } catch (error) {
            console.error(`Failed to fix issue: ${issue.message}`, error)
          }
        }
      }
    }

    // Write fixed content back to file
    await this.writeFile(filePath, content)

    // Log auto-fix history
    await prisma.autofixHistory.create({
      data: {
        filePath,
        issueType: issues[0]?.rule || 'general',
        fixApplied: fixes.join('\n'),
        success: fixes.length > 0
      }
    })

    return fixes.join('\n')
  }

  async generateCode(prompt: string, language: string, context?: any): Promise<string> {
    // Simulate AI code generation
    switch (language) {
      case 'gdscript':
        return this.generateGDScript(prompt, context)
      case 'csharp':
        return this.generateCSharp(prompt, context)
      case 'python':
        return this.generatePython(prompt, context)
      default:
        return this.generateJavaScript(prompt, context)
    }
  }

  private detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase()
    
    switch (ext) {
      case 'ts':
        return 'typescript'
      case 'js':
        return 'javascript'
      case 'gd':
        return 'gdscript'
      case 'cs':
        return 'csharp'
      case 'py':
        return 'python'
      default:
        return 'text'
    }
  }

  private analyzeJavaScript(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = content.split('\n')

    // TypeScript compiler analysis
    try {
      const sourceFile = ts.createSourceFile(
        filePath,
        content,
        ts.ScriptTarget.Latest,
        true
      )

      // Check for common issues
      this.walkTypeScriptNode(sourceFile, (node) => {
        if (ts.isFunctionDeclaration(node) && !node.name) {
          issues.push({
            filePath,
            line: node.pos,
            column: 0,
            severity: 'warning',
            message: 'Anonymous function should have a name',
            rule: 'no-anonymous-function'
          })
        }
      })
    } catch (error) {
      issues.push({
        filePath,
        line: 1,
        column: 0,
        severity: 'error',
        message: 'Syntax error in TypeScript/JavaScript code',
        rule: 'syntax-error'
      })
    }

    // Custom analysis
    lines.forEach((line, index) => {
      // Check for console.log statements
      if (line.includes('console.log')) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('console.log'),
          severity: 'warning',
          message: 'Console.log statement found',
          rule: 'no-console-log',
          fix: `// Remove console.log statement\n${line.replace(/console\.log\([^)]*\);?/, '')}`
        })
      }

      // Check for unused variables
      if (line.includes('let ') && !line.includes('=')) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('let '),
          severity: 'warning',
          message: 'Unused variable declaration',
          rule: 'unused-variable'
        })
      }
    })

    return issues
  }

  private analyzeGDScript(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // Check for proper indentation
      if (line.trim() && !line.startsWith('\t') && !line.startsWith('    ')) {
        issues.push({
          filePath,
          line: index + 1,
          column: 0,
          severity: 'warning',
          message: 'GDScript should use tabs for indentation',
          rule: 'gdscript-indentation'
        })
      }

      // Check for signal connections
      if (line.includes('.connect(') && !line.includes(')')) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('.connect('),
          severity: 'error',
          message: 'Incomplete signal connection',
          rule: 'incomplete-signal-connection'
        })
      }
    })

    return issues
  }

  private analyzeCSharp(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // Check for proper naming conventions
      if (line.includes('public class ') && !/public class [A-Z]/.test(line)) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('class '),
          severity: 'warning',
          message: 'Class name should start with uppercase',
          rule: 'csharp-naming-convention'
        })
      }

      // Check for async methods without await
      if (line.includes('async ') && !line.includes('await')) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('async '),
          severity: 'warning',
          message: 'Async method without await',
          rule: 'async-without-await'
        })
      }
    })

    return issues
  }

  private analyzePython(content: string, filePath: string): CodeIssue[] {
    const issues: CodeIssue[] = []
    const lines = content.split('\n')

    lines.forEach((line, index) => {
      // Check for PEP 8 compliance
      if (line.length > 79) {
        issues.push({
          filePath,
          line: index + 1,
          column: 79,
          severity: 'warning',
          message: 'Line too long (should be <= 79 characters)',
          rule: 'pep8-line-length'
        })
      }

      // Check for proper imports
      if (line.includes('import ') && line.includes(',')) {
        issues.push({
          filePath,
          line: index + 1,
          column: line.indexOf('import '),
          severity: 'warning',
          message: 'Multiple imports on one line',
          rule: 'pep8-import-style'
        })
      }
    })

    return issues
  }

  private calculateCyclomaticComplexity(content: string, language: string): number {
    let complexity = 1
    
    // Count decision points
    const patterns = {
      javascript: /\b(if|while|for|switch|case|catch|&&|\|\|)\b/g,
      typescript: /\b(if|while|for|switch|case|catch|&&|\|\|)\b/g,
      csharp: /\b(if|while|for|switch|case|catch|&&|\|\||\?)\b/g,
      python: /\b(if|while|for|elif|and|or)\b/g
    }

    const pattern = patterns[language as keyof typeof patterns]
    if (pattern) {
      const matches = content.match(pattern)
      complexity += matches ? matches.length : 0
    }

    return Math.min(complexity, 10) // Cap at 10
  }

  private calculateQualityScore(issues: CodeIssue[], complexity: number): number {
    let score = 100
    
    // Deduct points for issues
    issues.forEach(issue => {
      switch (issue.severity) {
        case 'error':
          score -= 10
          break
        case 'warning':
          score -= 5
          break
        case 'info':
          score -= 2
          break
      }
    })

    // Deduct points for complexity
    score -= complexity * 2

    return Math.max(0, Math.min(100, score))
  }

  private walkTypeScriptNode(node: ts.Node, callback: (node: ts.Node) => void): void {
    callback(node)
    ts.forEachChild(node, child => this.walkTypeScriptNode(child, callback))
  }

  private async readFile(filePath: string): Promise<string> {
    // Simulate file reading
    return `// Mock content for ${filePath}`
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    // Simulate file writing
    console.log(`Writing fixed content to ${filePath}`)
  }

  private generateGDScript(prompt: string, context?: any): string {
    return `extends Node2D

# Generated GDScript based on: ${prompt}
func _ready():
    # Initialize here
    pass

func _process(delta):
    # Update logic here
    pass`
  }

  private generateCSharp(prompt: string, context?: any): string {
    return `using Godot;
using System;

public class GeneratedNode : Node2D
{
    public override void _Ready()
    {
        // Generated based on: ${prompt}
    }

    public override void _Process(float delta)
    {
        // Update logic
    }
}`
  }

  private generatePython(prompt: string, context?: any): string {
    return `#!/usr/bin/env python3
"""
Generated Python script based on: ${prompt}
"""

import sys
import os

def main():
    """Main function"""
    print("Generated script executed")

if __name__ == "__main__":
    main()`
  }

  private generateJavaScript(prompt: string, context?: any): string {
    return `// Generated JavaScript based on: ${prompt}

(function() {
    'use strict';
    
    function init() {
        console.log('Generated script initialized');
    }
    
    document.addEventListener('DOMContentLoaded', init);
})();`
  }

  private initializePatterns(): void {
    // Initialize code patterns for different languages
    this.codePatterns.set('javascript', [
      { pattern: /console\.log/, fix: 'remove-console-log' },
      { pattern: /var\s+/, fix: 'use-let-const' },
      { pattern: /==\s*null/, fix: 'use-strict-equality' }
    ])
  }

  private initializeFixStrategies(): void {
    // Initialize auto-fix strategies
    this.fixStrategies.set('remove-console-log', async (content: string, issue: CodeIssue) => {
      return content.replace(/console\.log\([^)]*\);?/g, '')
    })

    this.fixStrategies.set('use-let-const', async (content: string, issue: CodeIssue) => {
      return content.replace(/var\s+/g, 'let ')
    })
  }
}

export const aiCore = new AICore()