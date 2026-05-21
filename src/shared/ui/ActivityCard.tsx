import { useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import type { Activity, ActivityType } from '@/src/entities/user/model/types';
import { theme } from '@/src/core/styles/theme';

const typeColors: Record<ActivityType, string> = {
  deber: theme.colors.deber,
  taller: theme.colors.taller,
  prueba: theme.colors.prueba,
  reunion: theme.colors.reunion,
};

const typeLabels: Record<ActivityType, string> = {
  deber: 'Deber',
  taller: 'Taller',
  prueba: 'Prueba',
  reunion: 'Reunión',
};

const typeBadgeBg: Record<ActivityType, string> = {
  deber: '#5B5FEF33',
  taller: '#12C2E933',
  prueba: '#EF444433',
  reunion: '#10B98133',
};

interface ActivityCardProps {
  activity: Activity;
  onPress: () => void;
  onDelete: () => void;
}

export default function ActivityCard({ activity, onPress, onDelete }: ActivityCardProps) {
  const swipeableRef = useRef<Swipeable>(null);
  const accentColor = typeColors[activity.type];

  const handleLongPress = () => {
    Alert.alert('Eliminar actividad', `¿Eliminar "${activity.subject}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: onDelete },
    ]);
  };

  const handleSwipeableOpen = (direction: string) => {
    if (direction === 'left') {
      Alert.alert(
        'Eliminar actividad',
        '¿Estás seguro de que quieres eliminar esta actividad?',
        [
          {
            text: 'Cancelar',
            style: 'cancel',
            onPress: () => swipeableRef.current?.close(),
          },
          {
            text: 'Eliminar',
            style: 'destructive',
            onPress: () => onDelete(),
          },
        ]
      );
    }
  };

  const renderLeftActions = () => (
    <View style={styles.deleteAction}>
      <Ionicons name="trash-outline" size={26} color="white" />
      <Text style={styles.deleteActionText}>Eliminar</Text>
    </View>
  );

  const formattedDate = new Date(activity.deadline).toLocaleDateString('es-EC', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const cardContent = (
    <View style={styles.card}>
      <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: typeBadgeBg[activity.type] }]}>
            <Text style={[styles.badgeText, { color: accentColor }]}>{typeLabels[activity.type]}</Text>
          </View>
          <View style={styles.spacer} />
          <View style={styles.deadlineRow}>
            <Ionicons name="time-outline" size={14} color={theme.colors.textMuted} />
            <Text style={styles.deadline}>{formattedDate}</Text>
          </View>
        </View>
        <Text style={styles.subject}>{activity.subject}</Text>
      </View>
    </View>
  );

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      onSwipeableOpen={handleSwipeableOpen}
    >
      <TouchableOpacity onPress={onPress} onLongPress={handleLongPress} activeOpacity={0.7}>
        {cardContent}
      </TouchableOpacity>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 12,
    marginHorizontal: 20,
    padding: 16,
    ...theme.shadow.card,
  },
  accentBar: {
    width: 4,
    borderRadius: 2,
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    flex: 1,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  subject: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: 6,
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  deadline: {
    fontSize: 13,
    color: theme.colors.textMuted,
  },
  deleteAction: {
    backgroundColor: '#EF4444',
    borderRadius: 16,
    marginBottom: 12,
    marginLeft: 20,
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
});
