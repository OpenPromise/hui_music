import type { SavedSearch } from "@/store/searchStore";

interface TemplateField {
  name: string;
  type: "text" | "select" | "date" | "number";
  required?: boolean;
  options?: string[];
  defaultValue?: string | number;
  description?: string;
  pattern?: string;
  min?: number;
  max?: number;
}

interface ImportTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  separator: string;
  timestamp: number;
}

// 生成默认模板
export function generateDefaultTemplates(): ImportTemplate[] {
  return [
    {
      id: "basic",
      name: "基础模板",
      description: "简单的标签导入模板",
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
          description: "标签名称",
          pattern: "^[a-zA-Z0-9\\u4e00-\\u9fa5\\-_\\s]+$",
        },
      ],
      separator: ",",
      timestamp: Date.now(),
    },
    {
      id: "music",
      name: "音乐标签模板",
      description: "音乐相关标签的导入模板",
      fields: [
        {
          name: "genre",
          type: "select",
          required: true,
          options: ["流行", "摇滚", "古典", "爵士", "电子", "其他"],
          description: "音乐流派",
        },
        {
          name: "mood",
          type: "select",
          required: false,
          options: ["欢快", "忧伤", "平静", "激情", "浪漫"],
          description: "情感标签",
        },
        {
          name: "year",
          type: "number",
          required: false,
          min: 1900,
          max: new Date().getFullYear(),
          description: "发行年份",
        },
      ],
      separator: "|",
      timestamp: Date.now(),
    },
  ];
}

// 生成模板示例数据
export function generateTemplateExample(template: ImportTemplate): string {
  const examples: string[][] = [];
  
  // 生成3行示例数据
  for (let i = 0; i < 3; i++) {
    const row = template.fields.map(field => {
      switch (field.type) {
        case "select":
          return field.options?.[Math.floor(Math.random() * field.options.length)] || "";
        case "number":
          const min = field.min || 0;
          const max = field.max || 100;
          return Math.floor(Math.random() * (max - min + 1) + min).toString();
        case "date":
          return new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0];
        default:
          return `示例${field.name}${i + 1}`;
      }
    });
    examples.push(row);
  }

  return examples.map(row => row.join(template.separator)).join("\n");
}

// 验证导入数据
export function validateImportData(
  data: string,
  template: ImportTemplate
): { isValid: boolean; errors: string[]; parsedData: string[] } {
  const errors: string[] = [];
  const rows = data.trim().split("\n");
  const parsedData: string[] = [];

  rows.forEach((row, index) => {
    const values = row.split(template.separator);

    // 检查字段数量
    if (values.length !== template.fields.length) {
      errors.push(`第 ${index + 1} 行: 字段数量不匹配`);
      return;
    }

    // 验证每个字段
    const validRow = template.fields.every((field, fieldIndex) => {
      const value = values[fieldIndex].trim();

      // 检查必填字段
      if (field.required && !value) {
        errors.push(`第 ${index + 1} 行: ${field.name} 不能为空`);
        return false;
      }

      // 检查字段类型
      switch (field.type) {
        case "select":
          if (value && !field.options?.includes(value)) {
            errors.push(
              `第 ${index + 1} 行: ${field.name} 必须是以下值之一: ${field.options?.join(
                ", "
              )}`
            );
            return false;
          }
          break;
        case "number":
          const num = Number(value);
          if (value && (isNaN(num) || (field.min !== undefined && num < field.min) || (field.max !== undefined && num > field.max))) {
            errors.push(
              `第 ${index + 1} 行: ${field.name} 必须是 ${field.min || "-∞"} 到 ${
                field.max || "∞"
              } 之间的数字`
            );
            return false;
          }
          break;
        case "text":
          if (value && field.pattern && !new RegExp(field.pattern).test(value)) {
            errors.push(`第 ${index + 1} 行: ${field.name} 格式不正确`);
            return false;
          }
          break;
      }

      return true;
    });

    if (validRow) {
      // 根据模板生成标签
      const tag = template.fields
        .map((field, i) => {
          const value = values[i].trim();
          if (!value) return null;
          switch (field.type) {
            case "select":
              return `${field.name}:${value}`;
            case "number":
              return `${field.name}:${value}`;
            default:
              return value;
          }
        })
        .filter(Boolean)
        .join("-");
      
      parsedData.push(tag);
    }
  });

  return {
    isValid: errors.length === 0,
    errors,
    parsedData,
  };
} 