/**
 * JSONL to Markdown Converter for Claude Code Sessions
 * Converts detailed JSONL output to a simplified "script" format for debugging
 */

function parseJSONL(jsonlString) {
    // First, try standard JSONL format (one JSON object per line)
    try {
        const lines = jsonlString.split('\n').filter(line => line.trim());
        // Test if first line is valid JSON
        if (lines.length > 0) {
            JSON.parse(lines[0]);
            return lines.map(line => JSON.parse(line));
        }
    } catch (e) {
        // If line-by-line parsing fails, try parsing as multi-line JSON objects
        const entries = [];
        let depth = 0;
        let currentEntry = '';

        for (let i = 0; i < jsonlString.length; i++) {
            const char = jsonlString[i];
            currentEntry += char;

            if (char === '{') depth++;
            if (char === '}') depth--;

            // When we reach depth 0 and have content, we have a complete object
            if (depth === 0 && currentEntry.trim()) {
                try {
                    entries.push(JSON.parse(currentEntry.trim()));
                    currentEntry = '';
                } catch (parseError) {
                    // Continue accumulating if parse fails
                }
            }
        }

        return entries;
    }

    return [];
}

function formatDuration(ms) {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
}

function extractTextContent(content) {
    if (!content) return '';
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content
            .map(item => {
                if (item.type === 'text') return item.text;
                if (item.type === 'tool_use') return `[Tool Call: ${item.name}]`;
                if (item.type === 'tool_result') return item.content;
                return '';
            })
            .filter(Boolean)
            .join('\n');
    }
    return '';
}

function getIndent(level) {
    return '    '.repeat(level);
}

function convertToMarkdown(jsonlString) {
    const entries = parseJSONL(jsonlString);
    const lines = [];

    // Track tool calls to map results back
    const toolCalls = new Map(); // tool_use_id -> { name, input, subagent_type, parent_tool_use_id }

    // Track which parent_tool_use_id indicates a sub-agent context
    const subAgentContexts = new Map(); // parent_tool_use_id -> subagent_type

    // Map tool results to their tool_use_id for immediate rendering
    const toolResults = new Map(); // tool_use_id -> { entry, item }

    // Track which results have been rendered to avoid duplicates
    const renderedResults = new Set(); // tool_use_id

    let currentTimestamp = 0;

    function getTimestamp() {
        const mins = Math.floor(currentTimestamp / 60);
        const secs = currentTimestamp % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // === PASS 1: Collect tool calls and results ===
    for (const entry of entries) {
        // Skip system init
        if (entry.type === 'system' && entry.subtype === 'init') {
            continue;
        }

        // Collect tool calls from assistant messages
        if (entry.type === 'assistant' && entry.message?.content) {
            const content = entry.message.content;
            if (!Array.isArray(content)) continue;

            for (const item of content) {
                if (item.type === 'tool_use') {
                    const toolName = item.name;
                    const toolInput = item.input || {};
                    const subagentType = toolInput.subagent_type;

                    // Store tool call info
                    toolCalls.set(item.id, {
                        name: toolName,
                        input: toolInput,
                        subagent_type: subagentType,
                        parent_tool_use_id: entry.parent_tool_use_id
                    });

                    // Track sub-agent contexts
                    if (toolName === 'Task' && subagentType) {
                        subAgentContexts.set(item.id, subagentType);
                    }
                }
            }
        }

        // Collect tool results from user messages
        if (entry.type === 'user' && entry.message?.content) {
            const content = entry.message.content;
            if (!Array.isArray(content)) continue;

            for (const item of content) {
                if (item.type === 'tool_result' && item.tool_use_id) {
                    // Store the result for later rendering with its call
                    toolResults.set(item.tool_use_id, { entry, item });
                }
            }
        }
    }

    // === PASS 2: Render with grouping ===
    for (const entry of entries) {
        // === SYSTEM INIT === (skip)
        if (entry.type === 'system' && entry.subtype === 'init') {
            continue;
        }

        // === ASSISTANT MESSAGE ===
        if (entry.type === 'assistant' && entry.message) {
            const content = entry.message.content;
            const isSubAgent = entry.parent_tool_use_id != null;
            const subAgentType = isSubAgent ? subAgentContexts.get(entry.parent_tool_use_id) : null;
            const actor = isSubAgent && subAgentType ? subAgentType.toUpperCase() : 'ORCHESTRATOR';

            if (!content || !Array.isArray(content)) continue;

            for (const item of content) {
                // Text content
                if (item.type === 'text' && item.text) {
                    const prefix = isSubAgent ? '> ' : '';
                    lines.push(`${prefix}### [${getTimestamp()}] 🤖 ${actor}`);
                    lines.push('');
                    lines.push('```md');
                    lines.push(item.text);
                    lines.push('```');
                    lines.push('');
                    currentTimestamp += 1;
                }

                // Tool use - render the call and immediately render its result if available
                if (item.type === 'tool_use') {
                    const toolInfo = toolCalls.get(item.id);
                    if (!toolInfo) continue;

                    const toolName = toolInfo.name;
                    const toolInput = toolInfo.input || {};
                    const subagentType = toolInfo.subagent_type;

                    // Format the call
                    let callDescription = toolName;
                    if (subagentType) {
                        callDescription = `${toolName} (${subagentType})`;
                    }

                    const prefix = isSubAgent ? '> ' : '';
                    lines.push(`${prefix}### [${getTimestamp()}] 🔧 ${actor} → ${callDescription}`);
                    lines.push('');

                    // Determine if input is JSON or text
                    let isJsonInput = false;
                    let inputContent = '';

                    if (toolInput.prompt) {
                        inputContent = toolInput.prompt;
                    } else if (toolInput.command) {
                        inputContent = toolInput.command;
                    } else if (toolInput.description) {
                        inputContent = toolInput.description;
                    } else {
                        isJsonInput = true;
                        inputContent = JSON.stringify(toolInput, null, 2);
                    }

                    lines.push(isJsonInput ? '```json' : '```md');
                    lines.push(inputContent);
                    lines.push('```');
                    lines.push('');
                    currentTimestamp += 1;

                    // === IMMEDIATELY RENDER RESULT IF AVAILABLE (but not for Task tools) ===
                    // Task tools (sub-agents) should keep chronological order to show parallel execution
                    const isTaskTool = toolInfo.name === 'Task';
                    const resultData = toolResults.get(item.id);
                    if (resultData && !renderedResults.has(item.id) && !isTaskTool) {
                        const resultEntry = resultData.entry;
                        const resultItem = resultData.item;

                        // Mark as rendered to skip later
                        renderedResults.add(item.id);

                        // Determine if this is a sub-agent's tool result
                        const isSubAgentToolResult = toolInfo.parent_tool_use_id != null;
                        const resultPrefix = isSubAgentToolResult ? '> ' : '';
                        
                        // Determine the actor that made the tool call
                        let resultActor = 'ORCHESTRATOR';
                        if (isSubAgentToolResult) {
                            const parentSubAgentType = subAgentContexts.get(toolInfo.parent_tool_use_id);
                            resultActor = parentSubAgentType ? parentSubAgentType.toUpperCase() : 'SUB-AGENT';
                        }

                        // Get duration if available
                        const duration = resultEntry.tool_use_result?.totalDurationMs;
                        const durationStr = duration ? ` ⏱️ ${formatDuration(duration)}` : '';

                        // Check if this is an error result
                        const isError = resultItem.is_error === true;
                        const statusIcon = isError ? '❌' : '📥';

                        // Determine the receiver
                        const receiver = toolInfo.subagent_type ? 'ORCHESTRATOR' : resultActor;

                        lines.push(`${resultPrefix}**→ Result:** ${statusIcon}${durationStr}`);
                        lines.push('');

                        // Extract result content
                        let resultText = '';
                        if (resultEntry.tool_use_result?.content) {
                            resultText = extractTextContent(resultEntry.tool_use_result.content);
                        } else if (Array.isArray(resultItem.content)) {
                            resultText = resultItem.content
                                .filter(c => c.type === 'text')
                                .map(c => c.text)
                                .join('\n');
                        } else if (typeof resultItem.content === 'string') {
                            resultText = resultItem.content;
                        }

                        // For error results, add an error indicator
                        if (isError && resultText) {
                            lines.push('```');
                            lines.push(`ERROR: ${resultText}`);
                            lines.push('```');
                        } else if (resultText) {
                            lines.push('```md');
                            lines.push(resultText);
                            lines.push('```');
                        }

                        lines.push('');
                        currentTimestamp += 2;
                    }
                }
            }
        }

        // === USER MESSAGE (Tool prompts to sub-agents) ===
        if (entry.type === 'user' && entry.message && entry.parent_tool_use_id) {
            // Check if this message contains tool results - if so, don't skip it
            const hasToolResults = entry.message.content?.some(item => item.type === 'tool_result');
            if (!hasToolResults) {
                // This is the prompt being sent to a sub-agent, we already captured it in tool_use
                // Skip to avoid duplication
                continue;
            }
            // If it has tool results, fall through to the TOOL RESULT section below
        }

        // === TOOL RESULT === (only render if not already rendered with call)
        if (entry.type === 'user' && entry.message?.content) {
            const content = entry.message.content;

            for (const item of content) {
                if (item.type === 'tool_result' && item.tool_use_id) {
                    // Skip if already rendered with its call
                    if (renderedResults.has(item.tool_use_id)) {
                        continue;
                    }

                    const toolInfo = toolCalls.get(item.tool_use_id);
                    if (!toolInfo) continue;

                    // Mark as rendered
                    renderedResults.add(item.tool_use_id);

                    // Determine if this is a sub-agent's tool result or orchestrator's tool result
                    const isSubAgentToolResult = toolInfo.parent_tool_use_id != null;
                    const prefix = isSubAgentToolResult ? '> ' : '';
                    
                    // Determine the actor that made the tool call
                    let actor = 'ORCHESTRATOR';
                    if (isSubAgentToolResult) {
                        const parentSubAgentType = subAgentContexts.get(toolInfo.parent_tool_use_id);
                        actor = parentSubAgentType ? parentSubAgentType.toUpperCase() : 'SUB-AGENT';
                    }

                    let callDescription = toolInfo.name;
                    if (toolInfo.subagent_type) {
                        callDescription = `${toolInfo.name} (${toolInfo.subagent_type})`;
                    }

                    // Get duration if available
                    const duration = entry.tool_use_result?.totalDurationMs;
                    const durationStr = duration ? ` ⏱️ ${formatDuration(duration)}` : '';

                    // Check if this is an error result
                    const isError = item.is_error === true;
                    const statusIcon = isError ? '❌' : '📥';

                    // Determine the receiver - for Task tool results, it's the orchestrator
                    // For sub-agent tool results, it's the sub-agent that called it
                    const receiver = toolInfo.subagent_type ? 'ORCHESTRATOR' : actor;

                    lines.push(`${prefix}### [${getTimestamp()}] ${statusIcon} ${callDescription} → ${receiver}${durationStr}`);
                    lines.push('');

                    // Extract result content
                    let resultText = '';
                    if (entry.tool_use_result?.content) {
                        resultText = extractTextContent(entry.tool_use_result.content);
                    } else if (Array.isArray(item.content)) {
                        resultText = item.content
                            .filter(c => c.type === 'text')
                            .map(c => c.text)
                            .join('\n');
                    } else if (typeof item.content === 'string') {
                        resultText = item.content;
                    }

                    // For error results, add an error indicator
                    if (isError && resultText) {
                        lines.push('```');
                        lines.push(`ERROR: ${resultText}`);
                        lines.push('```');
                    } else if (resultText) {
                        lines.push('```md');
                        lines.push(resultText);
                        lines.push('```');
                    }

                    lines.push('');
                    currentTimestamp += 2;
                }
            }
        }

        // === FINAL RESULT ===
        if (entry.type === 'result') {
            lines.push('---');
            lines.push('');
            lines.push(`## 🏁 Session Complete`);
            lines.push('');

            if (entry.subtype === 'success') {
                lines.push(`**Status:** ✅ Success`);
            } else {
                lines.push(`**Status:** ❌ ${entry.subtype || 'Error'}`);
            }

            if (entry.duration_ms) {
                lines.push(`**Total Duration:** ${formatDuration(entry.duration_ms)}`);
            }
            if (entry.num_turns) {
                lines.push(`**Turns:** ${entry.num_turns}`);
            }
            if (entry.total_cost_usd) {
                lines.push(`**Cost:** $${entry.total_cost_usd.toFixed(4)}`);
            }
        }
    }

    return lines.join('\n');
}

// === MAIN ===
// For Node.js CLI usage
if (typeof process !== 'undefined' && require.main === module) {
    const fs = require('fs');
    const path = require('path');

    const args = process.argv.slice(2);

    if (args.length === 0) {
        console.log('Usage: node jsonl-to-markdown.js <input.jsonl> [output.md]');
        console.log('');
        console.log('If output is not specified, prints to stdout.');
        process.exit(1);
    }

    const inputFile = args[0];
    const outputFile = args[1];

    try {
        const jsonlContent = fs.readFileSync(inputFile, 'utf-8');
        const markdown = convertToMarkdown(jsonlContent);

        if (outputFile) {
            fs.writeFileSync(outputFile, markdown);
            console.log(`✅ Converted to ${outputFile}`);
        } else {
            console.log(markdown);
        }
    } catch (err) {
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
}

// Export for module usage
if (typeof module !== 'undefined') {
    module.exports = { convertToMarkdown, parseJSONL };
}