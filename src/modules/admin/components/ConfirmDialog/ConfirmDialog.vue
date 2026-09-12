<script setup lang="ts">
import { useTemplateRef, watch } from 'vue'

const props = defineProps<{
  open: boolean
  title: string
  message: string
  confirmLabel?: string
}>()

const emit = defineEmits<{ confirm: []; cancel: [] }>()

const dialogRef = useTemplateRef<HTMLDialogElement>('dialog')

watch(
  () => props.open,
  (open) => {
    if (open) dialogRef.value?.showModal()
    else dialogRef.value?.close()
  },
)

function handleCancel() {
  emit('cancel')
}

function handleConfirm() {
  emit('confirm')
}
</script>

<template>
  <dialog ref="dialog" class="dialog" @cancel="handleCancel">
    <div class="inner">
      <h2>{{ title }}</h2>
      <p>{{ message }}</p>
      <div class="buttons">
        <button type="button" @click="handleCancel">Cancelar</button>
        <button type="button" class="confirm" @click="handleConfirm">
          {{ confirmLabel ?? 'Confirmar' }}
        </button>
      </div>
    </div>
  </dialog>
</template>

<style scoped src="./ConfirmDialog.css"></style>
