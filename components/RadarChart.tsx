
import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { colors } from '@/styles/commonStyles';

interface RadarChartProps {
  data: { label: string; value: number }[];
  benchmarkData: { label: string; value: number }[];
  maxValue?: number;
}

export default function RadarChart({ data, benchmarkData, maxValue = 5 }: RadarChartProps) {
  const size = Math.min(Dimensions.get('window').width - 80, 350);
  const center = size / 2;
  const radius = size / 2 - 60;
  const levels = 5;

  const angleStep = (2 * Math.PI) / data.length;

  const getPoint = (value: number, index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / maxValue) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const getLabelPoint = (index: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = radius + 40;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const userPoints = data.map((item, index) => getPoint(item.value, index));
  const benchmarkPoints = benchmarkData.map((item, index) => getPoint(item.value, index));

  const userPolygonPoints = userPoints.map((p) => `${p.x},${p.y}`).join(' ');
  const benchmarkPolygonPoints = benchmarkPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background levels */}
        {Array.from({ length: levels }).map((_, levelIndex) => {
          const levelRadius = ((levelIndex + 1) / levels) * radius;
          const levelPoints = data
            .map((_, index) => {
              const angle = angleStep * index - Math.PI / 2;
              return {
                x: center + levelRadius * Math.cos(angle),
                y: center + levelRadius * Math.sin(angle),
              };
            })
            .map((p) => `${p.x},${p.y}`)
            .join(' ');

          return (
            <Polygon
              key={levelIndex}
              points={levelPoints}
              fill="none"
              stroke={colors.skyBlue}
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Axis lines */}
        {data.map((_, index) => {
          const endPoint = getPoint(maxValue, index);
          return (
            <Line
              key={index}
              x1={center}
              y1={center}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke={colors.skyBlue}
              strokeWidth="1"
              opacity={0.3}
            />
          );
        })}

        {/* Benchmark polygon */}
        <Polygon
          points={benchmarkPolygonPoints}
          fill={colors.lilac}
          fillOpacity={0.3}
          stroke={colors.heading}
          strokeWidth="2"
          strokeDasharray="5,5"
        />

        {/* User polygon */}
        <Polygon
          points={userPolygonPoints}
          fill={colors.primaryButton}
          fillOpacity={0.3}
          stroke={colors.primaryButton}
          strokeWidth="2"
        />

        {/* User data points */}
        {userPoints.map((point, index) => (
          <Circle
            key={`user-${index}`}
            cx={point.x}
            cy={point.y}
            r="5"
            fill={colors.primaryButton}
          />
        ))}

        {/* Labels */}
        {data.map((item, index) => {
          const labelPoint = getLabelPoint(index);
          const shortLabel = item.label.length > 15 
            ? item.label.substring(0, 12) + '...' 
            : item.label;
          
          return (
            <SvgText
              key={`label-${index}`}
              x={labelPoint.x}
              y={labelPoint.y}
              fontSize="11"
              fontWeight="600"
              fill={colors.heading}
              textAnchor="middle"
            >
              {shortLabel}
            </SvgText>
          );
        })}
      </Svg>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.primaryButton }]} />
          <Text style={styles.legendText}>Your Score</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: colors.heading, opacity: 0.5 }]} />
          <Text style={styles.legendText}>Benchmark</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 20,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  legendText: {
    fontSize: 14,
    color: colors.primaryText,
    fontWeight: '500',
  },
});
