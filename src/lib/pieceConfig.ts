import type { IconType } from 'react-icons';
import {
  SiNginx,
  SiPostgresql,
  SiRedis,
  SiApachekafka,
  SiRabbitmq,
  SiDocker,
  SiPrometheus,
} from 'react-icons/si';
import type { Piece } from 'react-tetris/lib/models/Piece';

export type PieceConfig = {
  container: string;
  label: string;
  bg: string;
  glowColor: string;
  icon: IconType;
};

export const PIECE_CONFIG: Record<Piece, PieceConfig> = {
  I: {
    container: 'nginx',
    label: 'nginx',
    bg: '#16a34a',
    glowColor: '#16a34a',
    icon: SiNginx,
  },
  O: {
    container: 'postgres',
    label: 'postgres',
    bg: '#1d4ed8',
    glowColor: '#1d4ed8',
    icon: SiPostgresql,
  },
  T: {
    container: 'redis',
    label: 'redis',
    bg: '#dc2626',
    glowColor: '#dc2626',
    icon: SiRedis,
  },
  S: {
    container: 'kafka',
    label: 'kafka',
    bg: '#52525b',
    glowColor: '#71717a',
    icon: SiApachekafka,
  },
  Z: {
    container: 'rabbitmq',
    label: 'rabbitmq',
    bg: '#ea580c',
    glowColor: '#f97316',
    icon: SiRabbitmq,
  },
  L: {
    container: 'docker',
    label: 'docker',
    bg: '#0284c7',
    glowColor: '#0ea5e9',
    icon: SiDocker,
  },
  J: {
    container: 'prometheus',
    label: 'prometheus',
    bg: '#d97706',
    glowColor: '#f59e0b',
    icon: SiPrometheus,
  },
};
