import { useState, useEffect, useCallback } from 'react';
import { Tags, ChevronUp, ChevronDown } from 'lucide-react';
import {
  getAdminCategories, createCategory, updateCategory, deactivateCategory,
} from '@/api/adminApi';
import type { Category, CategoryGroups } from '@/api/category';

type CategoryType = 'MAIN' | 'SUB';

const SECTIONS: { type: CategoryType; title: string; hint: string }[] = [
  {
    type: 'MAIN',
    title: '대분류 — 판매 형태',
    hint: '한정판 / 일반처럼 "어떻게 파는가". 자주 늘어나지 않습니다.',
  },
  {
    type: 'SUB',
    title: '소분류 — 장르',
    hint: '조각 / 아트 토이처럼 "무엇인가". 메인 페이지가 이 단위로 나뉩니다.',
  },
];

const EMPTY: CategoryGroups = { main: [], sub: [] };

export default function AdminCategoryList() {
  const [groups, setGroups] = useState<CategoryGroups>(EMPTY);
  const [loading, setLoading] = useState(true);

  const [addingType, setAddingType] = useState<CategoryType | null>(null);
  const [newName, setNewName] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState('');

  const [loadError, setLoadError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setLoadError('');
    getAdminCategories()
      .then(setGroups)
      // 실패를 삼키면 "등록된 카테고리가 없습니다" 로 보인다.
      // 목록이 비어 있는 것과 못 불러온 것은 전혀 다른 상황이다.
      .catch(() => setLoadError('카테고리를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = (type: CategoryType) => {
    setAddingType(type);
    setNewName('');
    setFormError('');
  };

  const handleCreate = async () => {
    if (!addingType) return;

    const name = newName.trim();
    if (!name) return setFormError('이름을 입력해 주세요.');

    setFormError('');
    setSubmitting(true);
    try {
      await createCategory({ type: addingType, name });
      setAddingType(null);
      load();
    } catch (e) {
      const message = (e as { response?: { data?: { message?: string } } })
        .response?.data?.message;
      setFormError(message ?? '카테고리 추가에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRename = async (c: Category) => {
    const name = editName.trim();
    if (!name || name === c.name) {
      setEditingId(null);
      return;
    }
    await updateCategory(c.id, { name });
    setEditingId(null);
    load();
  };

  const handleMove = async (list: Category[], index: number, direction: -1 | 1) => {
    const target = list[index];
    const swap = list[index + direction];
    if (!swap) return;

    await Promise.all([
      updateCategory(target.id, { sortOrder: swap.sortOrder }),
      updateCategory(swap.id, { sortOrder: target.sortOrder }),
    ]);
    load();
  };

  const handleToggleActive = async (c: Category) => {
    if (c.isActive) {
      const used = c.usedCount ?? 0;
      if (used > 0) {
        alert(`이 분류로 등록된 상품이 ${used}건 있어 삭제할 수 없습니다.\n해당 상품의 분류를 먼저 바꿔 주세요.`);
        return;
      }
      if (!confirm('이 분류를 삭제할까요?')) return;

      try {
        await deactivateCategory(c.id);
      } catch (e) {
        const message = (e as { response?: { data?: { message?: string } } })
          .response?.data?.message;
        alert(message ?? '삭제에 실패했습니다.');
        return;
      }
    } else {
      await updateCategory(c.id, { isActive: true });
    }
    load();
  };

  const listOf = (type: CategoryType) => (type === 'MAIN' ? groups.main : groups.sub);

  return (
    <div className="p-8">
      <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
        <Tags className="w-3.5 h-3.5" />
        <span>카테고리 관리</span>
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">상품 카테고리</h1>
      <p className="text-xs text-gray-400 mb-6">
        대분류와 소분류는 서로 종속되지 않습니다. 상품 하나가 대분류 한 개, 소분류 한 개를 각각 갖습니다.
      </p>

      {loadError ? (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-8 text-center">
          <p className="text-sm text-red-600">{loadError}</p>
          <button onClick={load} className="mt-3 text-xs text-red-700 underline">다시 시도</button>
        </div>
      ) : loading ? (
        <div className="py-20 text-center text-sm text-gray-400">불러오는 중...</div>
      ) : (
        <div className="space-y-8">
          {SECTIONS.map((section) => {
            const list = listOf(section.type);
            return (
              <section key={section.type}>
                <div className="flex items-end justify-between mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-gray-900">{section.title}</h2>
                    <p className="text-xs text-gray-400 mt-0.5">{section.hint}</p>
                  </div>
                  <button
                    onClick={() => openAdd(section.type)}
                    className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover transition-colors"
                  >
                    + 추가
                  </button>
                </div>

                {addingType === section.type && (
                  <div className="bg-white rounded-xl border border-gray-200 p-4 mb-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="block text-xs text-gray-500 mb-1">이름</label>
                        <input
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder={section.type === 'MAIN' ? '예: 한정판, 오픈에디션, 원작' : '예: 조각, 아트토이, 도자'}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-koala-navy"
                          autoFocus
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      이름만 넣으면 됩니다. 이름은 나중에 언제든 바꿀 수 있습니다.
                    </p>
                    {formError && <p className="text-xs text-red-500 mt-2">{formError}</p>}

                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={handleCreate}
                        disabled={submitting}
                        className="px-3 py-2 text-xs bg-koala-navy text-white rounded-lg hover:bg-koala-navy-hover disabled:opacity-50 transition-colors"
                      >
                        {submitting ? '추가하는 중...' : '추가'}
                      </button>
                      <button
                        onClick={() => setAddingType(null)}
                        className="px-3 py-2 text-xs bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        취소
                      </button>
                    </div>
                  </div>
                )}

                {list.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 py-12 text-center text-sm text-gray-400">
                    등록된 카테고리가 없습니다.
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                    {list.map((c, i) => (
                      <div
                        key={c.id}
                        className={`flex items-center gap-3 px-4 py-3 ${c.isActive ? '' : 'bg-gray-50'}`}
                      >
                        <div className="flex flex-col">
                          <button
                            onClick={() => handleMove(list, i, -1)}
                            disabled={i === 0}
                            className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-300"
                            title="위로"
                          >
                            <ChevronUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(list, i, 1)}
                            disabled={i === list.length - 1}
                            className="text-gray-300 hover:text-gray-600 disabled:opacity-30 disabled:hover:text-gray-300"
                            title="아래로"
                          >
                            <ChevronDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          {editingId === c.id ? (
                            <input
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              onBlur={() => handleRename(c)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleRename(c);
                                if (e.key === 'Escape') setEditingId(null);
                              }}
                              className="px-2 py-1 text-sm border border-koala-navy rounded focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <button
                              onClick={() => { setEditingId(c.id); setEditName(c.name); }}
                              className={`text-sm font-medium hover:underline ${c.isActive ? 'text-gray-900' : 'text-gray-400'}`}
                              title="클릭해서 이름 변경"
                            >
                              {c.name}
                            </button>
                          )}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          상품 {c.usedCount ?? 0}건
                        </span>
                        <button
                          onClick={() => handleToggleActive(c)}
                          className={`px-3 py-1.5 text-xs rounded-lg transition-colors font-medium flex-shrink-0
                            ${c.isActive
                              ? 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-600'
                              : 'bg-koala-purple/10 text-koala-purple hover:bg-koala-purple/20'}`}
                        >
                          {c.isActive ? '삭제' : '되살리기'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
