"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { TagRole } from "@/services/tagPermissionService";
import type { PermissionTemplate } from "@/types/permission";
import type { AuditLogEntry } from "@/types/audit";
import { showToast } from "@/lib/toast";

export function useTagPermissions() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [permissions, setPermissions] = useState<Record<string, Array<{
    user: { id: string; name: string; email: string };
    role: TagRole;
  }>>>({});
  const [hierarchy, setHierarchy] = useState<Record<string, {
    parents: string[];
    children: string[];
  }>>({});
  const [templates, setTemplates] = useState<PermissionTemplate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);

  // 获取权限数据
  useEffect(() => {
    async function fetchData() {
      if (!session) return;

      try {
        console.log('开始获取权限数据...');
        
        // 获取标签权限
        const permissionsRes = await fetch('/api/tags/permissions');
        if (!permissionsRes.ok) {
          throw new Error(`获取权限失败: ${permissionsRes.statusText}`);
        }
        const permissionsData = await permissionsRes.json();
        console.log('权限数据:', permissionsData);
        setPermissions(permissionsData);

        // 获取权限继承关系
        const hierarchyRes = await fetch('/api/tags/hierarchy');
        if (!hierarchyRes.ok) {
          throw new Error(`获取层级关系失败: ${hierarchyRes.statusText}`);
        }
        const hierarchyData = await hierarchyRes.json();
        console.log('层级数据:', hierarchyData);
        setHierarchy(hierarchyData);

        // 获取权限模板
        const templatesRes = await fetch('/api/tags/templates');
        if (!templatesRes.ok) {
          throw new Error(`获取模板失败: ${templatesRes.statusText}`);
        }
        const templatesData = await templatesRes.json();
        console.log('模板数据:', templatesData);
        setTemplates(templatesData);

        // 获取审计日志
        const auditRes = await fetch('/api/tags/audit');
        if (!auditRes.ok) {
          throw new Error(`获取审计日志失败: ${auditRes.statusText}`);
        }
        const auditData = await auditRes.json();
        console.log('审计数据:', auditData);
        setAuditLogs(auditData);

        setLoading(false);
      } catch (err) {
        console.error('数据获取失败:', err);
        setError(err as Error);
        setLoading(false);
        showToast.error('加载权限数据失败');
      }
    }

    fetchData();
  }, [session]);

  // 添加权限
  const addPermission = async (userId: string, role: TagRole) => {
    try {
      const res = await fetch('/api/tags/permissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error('添加权限失败');
      
      const newPermission = await res.json();
      setPermissions(prev => ({
        ...prev,
        [newPermission.tag]: [...(prev[newPermission.tag] || []), newPermission],
      }));
      showToast.success('添加权限成功');
    } catch (error) {
      showToast.error('添加权限失败');
      throw error;
    }
  };

  // 更新权限
  const updatePermission = async (userId: string, role: TagRole) => {
    try {
      const res = await fetch('/api/tags/permissions', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role }),
      });
      if (!res.ok) throw new Error('更新权限失败');
      
      const updatedPermission = await res.json();
      setPermissions(prev => ({
        ...prev,
        [updatedPermission.tag]: prev[updatedPermission.tag].map(p =>
          p.user.id === userId ? updatedPermission : p
        ),
      }));
      showToast.success('更新权限成功');
    } catch (error) {
      showToast.error('更新权限失败');
      throw error;
    }
  };

  // ... 其他权限管理函数

  return {
    loading,
    error,
    permissions,
    hierarchy,
    templates,
    auditLogs,
    addPermission,
    updatePermission,
    // ... 其他返回值
  };
} 