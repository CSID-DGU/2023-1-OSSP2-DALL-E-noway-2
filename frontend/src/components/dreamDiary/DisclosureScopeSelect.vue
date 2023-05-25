<script setup lang="ts">
import { DisclosureScopeType } from '@/types/enum/disclosure.scope';

defineProps(['disclosureScope']);
defineEmits(['update:disclosureScope']);
</script>

<template>
  <select
    id="disclosure-scope"
    aria-placeholder="공개범위 선택"
    :value="disclosureScope"
    @input="$emit('update:disclosureScope', $event.target.value)"
    required
  >
    <option value="">공개범위 선택</option>
    <option :value="DisclosureScopeType.PRIVATE">나만 보기</option>
    <option :value="DisclosureScopeType.PUBLIC">전체 공개</option>
    <option :value="DisclosureScopeType.LIMITED_PUBLIC">팔로워만 보기</option>
  </select>
</template>

<style scoped>
#disclosure-scope {
  @apply bg-[#E5E5E5] opacity-50 rounded-sm p-2 w-full h-full border border-gray-300;
}
</style>
