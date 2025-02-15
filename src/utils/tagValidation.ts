interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validTags: string[];
}

interface ValidationOptions {
  maxLength?: number;
  minLength?: number;
  allowedCharacters?: RegExp;
  maxTags?: number;
  checkDuplicates?: boolean;
  existingTags?: string[];
}

const defaultOptions: ValidationOptions = {
  maxLength: 50,
  minLength: 1,
  allowedCharacters: /^[a-zA-Z0-9\u4e00-\u9fa5\-_\s]+$/,
  maxTags: 1000,
  checkDuplicates: true,
};

export function validateTags(tags: unknown, options: ValidationOptions = {}): ValidationResult {
  const opts = { ...defaultOptions, ...options };
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: [],
    validTags: [],
  };

  // 检查输入类型
  if (!Array.isArray(tags)) {
    result.errors.push("导入数据必须是标签数组");
    result.isValid = false;
    return result;
  }

  // 检查数组大小
  if (tags.length > opts.maxTags!) {
    result.errors.push(`标签数量超过限制 (最大 ${opts.maxTags} 个)`);
    result.isValid = false;
    return result;
  }

  // 检查每个标签
  const seenTags = new Set<string>();
  tags.forEach((tag, index) => {
    // 类型检查
    if (typeof tag !== "string") {
      result.errors.push(`第 ${index + 1} 个标签必须是字符串`);
      return;
    }

    const trimmedTag = tag.trim();

    // 长度检查
    if (trimmedTag.length < opts.minLength!) {
      result.errors.push(`第 ${index + 1} 个标签太短 (最少 ${opts.minLength} 个字符)`);
      return;
    }
    if (trimmedTag.length > opts.maxLength!) {
      result.errors.push(`第 ${index + 1} 个标签太长 (最多 ${opts.maxLength} 个字符)`);
      return;
    }

    // 字符检查
    if (!opts.allowedCharacters!.test(trimmedTag)) {
      result.errors.push(`第 ${index + 1} 个标签包含无效字符`);
      return;
    }

    // 重复检查
    if (opts.checkDuplicates && seenTags.has(trimmedTag.toLowerCase())) {
      result.warnings.push(`标签 "${trimmedTag}" 重复`);
      return;
    }
    seenTags.add(trimmedTag.toLowerCase());

    // 与现有标签重复检查
    if (opts.existingTags?.includes(trimmedTag)) {
      result.warnings.push(`标签 "${trimmedTag}" 已存在`);
    }

    result.validTags.push(trimmedTag);
  });

  result.isValid = result.errors.length === 0;
  return result;
} 