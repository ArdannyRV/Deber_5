import { useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Modal, Alert,
  StyleSheet, Platform, StatusBar, TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import LottieView from 'lottie-react-native';
import AnimatedBackground from '@/src/shared/ui/AnimatedBackground';
import { supabase } from '@/src/shared/api/supabase';
import { useSession } from '@/src/features/session/model/useSession';
import {
  useActivities, useCreateActivity, useUpdateActivity, useDeleteActivity,
} from '@/src/features/activities/model/useActivities';
import ActivityCard from '@/src/shared/ui/ActivityCard';
import Input from '@/src/shared/ui/Input';
import Button from '@/src/shared/ui/Button';
import { theme } from '@/src/core/styles/theme';
import type { ActivityType, Activity } from '@/src/entities/user/model/types';

const TYPE_OPTIONS: { key: ActivityType; label: string }[] = [
  { key: 'deber', label: 'Deber' },
  { key: 'taller', label: 'Taller' },
  { key: 'prueba', label: 'Prueba' },
  { key: 'reunion', label: 'Reunión' },
];

const typeColors: Record<ActivityType, string> = {
  deber: theme.colors.deber,
  taller: theme.colors.taller,
  prueba: theme.colors.prueba,
  reunion: theme.colors.reunion,
};

function formatDisplayDate(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function HomePage() {
  const { session } = useSession();
  const userEmail = session?.user?.email ?? '';
  const initial = userEmail.charAt(0).toUpperCase();

  const { activities, isLoading, refetch } = useActivities();
  const createActivity = useCreateActivity();
  const updateActivity = useUpdateActivity();
  const deleteActivity = useDeleteActivity();

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [formSubject, setFormSubject] = useState('');
  const [formType, setFormType] = useState<ActivityType>('deber');

  // Date picker state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setFormSubject('');
    setFormType('deber');
    setSelectedDate(new Date());
    setModalVisible(true);
  };

  const openEdit = (a: Activity) => {
    setEditing(a);
    setFormSubject(a.subject);
    setFormType(a.type);
    setSelectedDate(new Date(a.deadline));
    setModalVisible(true);
  };

  const handleDateChange = (_e: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (date) {
        setSelectedDate((prev) => {
          const next = new Date(date);
          next.setHours(prev.getHours(), prev.getMinutes(), 0, 0);
          return next;
        });
        setShowTimePicker(true);
      }
      return;
    }
    if (date) setSelectedDate(date);
  };

  const handleTimeChange = (_e: DateTimePickerEvent, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowTimePicker(false);
      if (date) {
        setSelectedDate((prev) => {
          const next = new Date(prev);
          next.setHours(date.getHours(), date.getMinutes(), 0, 0);
          return next;
        });
      }
      return;
    }
    if (date) setSelectedDate(date);
  };

  const handleSave = async () => {
    if (!formSubject.trim()) return;

    try {
      if (editing) {
        await updateActivity.mutateAsync({
          id: editing.id,
          subject: formSubject.trim(),
          type: formType,
          deadline: selectedDate.toISOString(),
        });
      } else {
        await createActivity.mutateAsync({
          subject: formSubject.trim(),
          type: formType,
          deadline: selectedDate.toISOString(),
        });
      }
      setModalVisible(false);
    } catch { /* handled by react-query */ }
  };

  const handleDelete = useCallback(
    (id: string) => deleteActivity.mutate(id),
    [deleteActivity]
  );

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/login');
  };

  const isSubmitting = createActivity.isPending || updateActivity.isPending;

  const renderItem = ({ item }: { item: Activity }) => (
    <ActivityCard
      activity={item}
      onPress={() => openEdit(item)}
      onDelete={() => handleDelete(item.id)}
    />
  );

  const renderEmpty = () => {
    if (isLoading) return null;
    return (
      <View style={styles.empty}>
        <LottieView
          source={require('@/assets/animations/No History.json')}
          autoPlay
          loop
          style={{ width: 280, height: 280 }}
        />
        <Text style={styles.emptyTitle}>Sin actividades</Text>
        <Text style={styles.emptySubtitle}>Toca + para agregar tu primera actividad</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.bg} />
      <AnimatedBackground />

      {/* Header — semi-transparent over animated bg */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Activity Container</Text>
          <Text style={styles.headerEmail} numberOfLines={1}>
            {userEmail}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => router.push('/change-password')} style={styles.iconBtn}>
            <Ionicons name="lock-closed-outline" size={22} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.iconBtn}>
            <Ionicons name="log-out-outline" size={24} color={theme.colors.danger} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Mis Actividades</Text>
        <Text style={styles.sectionSubtitle}>
          {activities.length} {activities.length === 1 ? 'actividad pendiente' : 'actividades pendientes'}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={activities}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={activities.length === 0 ? styles.listEmpty : styles.listContent}
        refreshing={isLoading}
        onRefresh={refetch}
      />

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={openCreate} activeOpacity={0.8}>
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>

      {/* Create / Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalSheet}>
                <Text style={styles.modalTitle}>
                  {editing ? 'Editar Actividad' : 'Nueva Actividad'}
                </Text>

                <Input
                  label="Materia / Descripción"
                  value={formSubject}
                  onChangeText={setFormSubject}
                  placeholder="Ej: Parcial de Cálculo"
                />

                {/* Type selector */}
                <Text style={styles.fieldLabel}>Tipo</Text>
                <View style={styles.typeRow}>
                  {TYPE_OPTIONS.map((opt) => {
                    const selected = formType === opt.key;
                    return (
                      <TouchableOpacity
                        key={opt.key}
                        style={[
                          styles.typePill,
                          selected
                            ? { backgroundColor: typeColors[opt.key], borderColor: typeColors[opt.key] }
                            : styles.typePillUnselected,
                        ]}
                        onPress={() => setFormType(opt.key)}
                      >
                        <Text
                          style={[
                            styles.typePillText,
                            selected ? styles.typePillTextSelected : styles.typePillTextUnselected,
                          ]}
                        >
                          {opt.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Date picker */}
                <Text style={styles.fieldLabel}>Fecha límite</Text>
                <TouchableOpacity
                  style={styles.dateInput}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={[styles.dateText, !selectedDate && styles.datePlaceholder]}>
                    {selectedDate ? formatDisplayDate(selectedDate) : 'Seleccionar fecha'}
                  </Text>
                  <Ionicons name="calendar-outline" size={20} color={theme.colors.textMuted} />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleDateChange}
                    locale="es-EC"
                  />
                )}

                {showTimePicker && Platform.OS === 'android' && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={handleTimeChange}
                    locale="es-EC"
                  />
                )}

                {showDatePicker && Platform.OS === 'ios' && (
                  <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="spinner"
                    onChange={handleTimeChange}
                    locale="es-EC"
                  />
                )}

                {/* Buttons */}
                <View style={styles.modalButtonRow}>
                  <View style={styles.modalButtonFlex}>
                    <Button label="Cancelar" onPress={() => setModalVisible(false)} variant="ghost" />
                  </View>
                  <View style={styles.modalButtonGap} />
                  <View style={styles.modalButtonFlex}>
                    <Button label="Guardar" onPress={handleSave} isLoading={isSubmitting} />
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.bg,
  },
  header: {
    backgroundColor: 'rgba(255,255,255,0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE3FF',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: theme.colors.text,
  },
  headerEmail: {
    fontSize: 11,
    color: theme.colors.textMuted,
    marginTop: 1,
    maxWidth: 160,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: theme.colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    paddingTop: 12,
    paddingBottom: 100,
  },
  listEmpty: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: 4,
    paddingHorizontal: 40,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.fab,
  },
  fabIcon: {
    fontSize: 32,
    fontWeight: '300',
    color: theme.colors.white,
    lineHeight: 60,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: theme.colors.text,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textMid,
    marginBottom: 8,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typePill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    borderWidth: 1,
  },
  typePillUnselected: {
    backgroundColor: theme.colors.bg,
    borderColor: theme.colors.border,
  },
  typePillText: {
    fontSize: 13,
    fontWeight: '600',
  },
  typePillTextSelected: {
    color: theme.colors.white,
  },
  typePillTextUnselected: {
    color: theme.colors.textMid,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    paddingHorizontal: 16,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.inputBg,
    borderWidth: 1.5,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  dateText: {
    fontSize: 15,
    color: theme.colors.text,
  },
  datePlaceholder: {
    color: theme.colors.textMuted,
  },
  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 8,
  },
  modalButtonFlex: {
    flex: 1,
  },
  modalButtonGap: {
    width: 12,
  },
});
