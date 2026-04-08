"use client";

import {AvailableFieldConfig, FilterPanelProps} from "../types";
import {useMemo, useState} from "react";
import {StringUtil} from "@/utilities/stringUtil";
import {SearchIcon} from "../../../icon/searchIcon";
import BaseInput from "../../input/baseInput";
import ModernSelect from "../../select/modernSelect";
import type {ModernSelectOption} from "../../select/modernSelect";
import BaseDatePicker from "../../datepicker/baseDatePicker";
import BaseButton from "../../button/baseButton";
import {ChevronDown} from "lucide-react";

const DefaultFilterPanel: React.FC<FilterPanelProps> = ({
                                                            searchText,
                                                            setSearchText,
                                                            columnFilters = {},
                                                            setColumnFilter,
                                                            sort,
                                                            setSort,
                                                            resetFilters,
                                                            applyFilters,
                                                            availableFields = [],
                                                            onClose,
                                                            showGlobalSearch = true,
                                                            showColumnFilters = true,
                                                            showSortingControls = true,
                                                            style,
                                                            className,
                                                        }) => {
    const [expandedGroup, setExpandedGroup] = useState<string | "">("");

    // Group fields by type for better organization
    const fieldGroups = useMemo(() => {
        return availableFields.reduce((groups, field) => {
            const group = StringUtil.convertToSentenceCase(field.type || "other");
            if (!groups[group]) groups[group] = [];
            groups[group].push({
                ...field,
                label: StringUtil.convertToSentenceCase(field.label),
            });
            return groups;
        }, {} as Record<string, AvailableFieldConfig[]>);
    }, [availableFields]);

    const toggleGroup = (groupName: string) => {
        setExpandedGroup(prev => prev === groupName ? "" : groupName);
    };

    return (
        <div
            className={`flex flex-col gap-4 p-6 bg-card border border-border rounded-lg ${className || ""}`}
            style={style}
        >
            {/* Global Search */}
            {showGlobalSearch && (
                <BaseInput
                    name="global-search"
                    label="Global Search"
                    inputProps={{
                        placeholder: "Search across all fields...",
                        value: searchText,
                        onChange: (e) => setSearchText?.(e.target.value),
                    }}
                    startIcon={<SearchIcon/>}
                />
            )}

            {/* Column Filters — Collapsible Groups */}
            {showColumnFilters && (
                <div className="flex flex-col gap-3">
                    {Object.entries(fieldGroups).map(([groupName, fields]) => {
                        const isExpanded = expandedGroup === groupName;
                        const groupHasActiveFilters = fields.some(
                            field => columnFilters[field.field] && columnFilters[field.field] !== ""
                        );

                        return (
                            <div key={groupName}>
                                {/* Group Header */}
                                <button
                                    onClick={() => toggleGroup(groupName)}
                                    className="w-full flex items-center justify-between px-3 py-2 bg-muted hover:bg-muted/80 rounded-md transition-colors cursor-pointer"
                                    type="button"
                                >
                                    <span className="text-sm font-medium text-foreground flex items-center gap-2">
                                        {groupName}
                                        {groupHasActiveFilters && (
                                            <span className="w-2 h-2 bg-primary rounded-full"/>
                                        )}
                                    </span>
                                    <ChevronDown
                                        className={`w-4 h-4 text-muted-foreground transition-transform ${
                                            isExpanded ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>

                                {/* Collapsible Fields Grid */}
                                {isExpanded && (
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {fields.map((field) => (
                                            <div key={field.field} className="min-w-0">
                                                {(field.type === "text" || field.type === "number") && (
                                                    <BaseInput
                                                        name={`filter-${field.field}`}
                                                        label={field.label}
                                                        {...field.componentProps}
                                                        inputProps={{
                                                            type: field.type === "number" ? "number" : "text",
                                                            value: columnFilters[field.field] || "",
                                                            onChange: (e) =>
                                                                setColumnFilter?.(field.field, e.target.value),
                                                            placeholder: "Filter...",
                                                            ...field.inputProps,
                                                        }}
                                                    />
                                                )}

                                                {field.type === "select" && (
                                                    <ModernSelect
                                                        label={field.label}
                                                        {...field.componentProps}
                                                        placeholderLabel={`All ${field.label}`}
                                                        selectOptions={[
                                                            {value: "", label: `All ${field.label}`},
                                                            ...(field.options || []).map((opt): ModernSelectOption =>
                                                                typeof opt === "string"
                                                                    ? {value: opt, label: opt}
                                                                    : {value: String(opt.value), label: opt.label}
                                                            ),
                                                        ]}
                                                        value={columnFilters[field.field] || ""}
                                                        onOptionSelect={(value) =>
                                                            setColumnFilter?.(field.field, value)
                                                        }
                                                        addDefaultSelectOption={false}
                                                        searchable={(field.options?.length ?? 0) > 7}
                                                        size="small"
                                                        dropdownZIndex="z-[9999]"
                                                    />
                                                )}

                                                {field.type === "date" && (
                                                    <BaseDatePicker
                                                        name={`filter-${field.field}`}
                                                        label={field.label}
                                                        dateFormat={
                                                            field.dateFormat ||
                                                            field.componentProps?.dateFormat ||
                                                            "date-only"
                                                        }
                                                        {...field.componentProps}
                                                        selected={columnFilters[field.field]}
                                                        onSelect={(value) => {
                                                            setColumnFilter?.(field.field, value);
                                                        }}
                                                        placeholder="Select..."
                                                        className="w-full"
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Sorting Controls */}
            {showSortingControls && (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                        <ModernSelect
                            label="Sort By"
                            selectOptions={[
                                ...availableFields.map((field) => ({
                                    label: field.label,
                                    value: field.field,
                                })),
                            ]}
                            onOptionSelect={(option) => {
                                if (option) {
                                    setSort?.(String(option.value), sort?.direction || "ASC");
                                } else {
                                    setSort?.("", "ASC");
                                }
                            }}
                            value={sort?.field || ""}
                        />
                    </div>

                    {sort?.field && (
                        <div>
                            <ModernSelect
                                label="Sort Direction"
                                selectOptions={[
                                    {label: "Ascending", value: "ASC"},
                                    {label: "Descending", value: "DESC"},
                                ]}
                                onOptionSelect={(option) => {
                                    if (sort?.field) {
                                        setSort?.(sort.field, String(option.value) as "ASC" | "DESC");
                                    }
                                }}
                                value={sort?.direction || "ASC"}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between gap-3 w-full mt-4 pt-3 border-t border-border">
                <BaseButton
                    text="Close"
                    onClick={onClose}
                    variant="text"
                    size="small"
                />
                <div className="flex justify-end gap-3">
                    <BaseButton
                        variant="secondary"
                        text="Reset Filters"
                        onClick={resetFilters}
                        size="small"
                    />
                    <BaseButton
                        text="Apply Filters"
                        onClick={applyFilters}
                        size="small"
                    />
                </div>
            </div>
        </div>
    );
};

export default DefaultFilterPanel;
