import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Lock,
  Building2,
  Database,
  Shield,
  ArrowRight,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '@/store/authStore';
import { mockUsers } from '@/mock';
import { cn } from '@/lib/utils';

const loginSchema = z.object({
  email: z.string().email('请输入有效的邮箱地址'),
  role: z.enum(['applicant', 'provider', 'admin'], {
    required_error: '请选择用户角色',
  }),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'zhangming@example.com',
      role: 'applicant',
    },
  });

  const selectedRole = watch('role');

  const roleOptions = [
    {
      value: 'applicant',
      label: '数据需求方',
      description: '浏览、申请、使用数据产品',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
    },
    {
      value: 'provider',
      label: '数据提供方',
      description: '发布、管理、授权数据产品',
      icon: Building2,
      color: 'from-accent-950 to-teal-600',
    },
    {
      value: 'admin',
      label: '平台运营方',
      description: '审核产品、查看运营数据',
      icon: Shield,
      color: 'from-primary-950 to-indigo-600',
    },
  ];

  const onSubmit = async (data: LoginFormData) => {
    const user = mockUsers.find((u) => u.email === data.email && u.role === data.role);
    if (user) {
      login(data.email, data.role);
      navigate('/');
    } else {
      alert('用户不存在，请检查邮箱和角色选择');
    }
  };

  const getQuickLoginEmails = () => {
    if (selectedRole === 'applicant') {
      return mockUsers.filter((u) => u.role === 'applicant').map((u) => ({ name: u.name, email: u.email }));
    } else if (selectedRole === 'provider') {
      return mockUsers.filter((u) => u.role === 'provider').map((u) => ({ name: u.name, email: u.email }));
    } else {
      return mockUsers.filter((u) => u.role === 'admin').map((u) => ({ name: u.name, email: u.email }));
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-950 via-blue-800 to-accent-950 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-accent-950 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Database className="w-7 h-7" />
            </div>
            <span className="text-2xl font-bold">数据要素流通平台</span>
          </div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            让数据
            <br />
            <span className="bg-gradient-to-r from-accent-400 to-teal-300 bg-clip-text text-transparent">
              创造价值
            </span>
          </h1>
          <p className="text-lg text-white/80 mb-12 leading-relaxed">
            安全、高效、合规的数据要素流通平台，连接数据供需双方，
            促进数据资产化、价值化，赋能数字经济高质量发展。
          </p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold text-accent-400">1,258</p>
              <p className="text-sm text-white/70 mt-1">上架产品</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold text-accent-400">3,426</p>
              <p className="text-sm text-white/70 mt-1">成功交易</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <p className="text-3xl font-bold text-accent-400">856</p>
              <p className="text-sm text-white/70 mt-1">注册用户</p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 bg-primary-950 rounded-xl flex items-center justify-center">
              <Database className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-neutral-800">数据要素流通平台</span>
          </div>

          <h2 className="text-3xl font-bold text-neutral-800 mb-2">欢迎回来</h2>
          <p className="text-neutral-500 mb-8">请登录您的账户以继续</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                选择您的角色
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;
                  return (
                    <label
                      key={role.value}
                      className={cn(
                        'relative border-2 rounded-xl p-4 cursor-pointer transition-all',
                        isSelected
                          ? 'border-primary-950 bg-primary-50'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}
                    >
                      <input
                        type="radio"
                        {...register('role')}
                        value={role.value}
                        className="sr-only"
                      />
                      <div
                        className={cn(
                          'w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-gradient-to-br',
                          role.color
                        )}
                      >
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <p className="font-semibold text-neutral-800 text-sm">{role.label}</p>
                      <p className="text-xs text-neutral-500 mt-1">{role.description}</p>
                    </label>
                  );
                })}
              </div>
              {errors.role && (
                <p className="text-red-500 text-sm mt-2">{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                邮箱地址
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="请输入邮箱地址"
                  className="input pl-10 w-full"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="password"
                  placeholder="请输入密码"
                  defaultValue="password"
                  className="input pl-10 w-full"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-neutral-300 text-primary-950 focus:ring-primary-950" />
                <span className="text-neutral-600">记住我</span>
              </label>
              <a href="#" className="text-primary-950 hover:underline">忘记密码?</a>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
            >
              {isSubmitting ? '登录中...' : '登录'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8">
            <p className="text-sm text-neutral-500 mb-3">
              快速登录（{roleOptions.find(r => r.value === selectedRole)?.label}）：
            </p>
            <div className="flex flex-wrap gap-2">
              {getQuickLoginEmails().map((user) => (
                <button
                  key={user.email}
                  onClick={() => {
                    login(user.email, selectedRole);
                    navigate('/');
                  }}
                  className="px-3 py-1.5 text-sm bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  {user.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-neutral-100">
            <p className="text-xs text-neutral-400 text-center">
              登录即表示您同意我们的
              <a href="#" className="text-primary-950 hover:underline">服务条款</a>
              和
              <a href="#" className="text-primary-950 hover:underline">隐私政策</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
