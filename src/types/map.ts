import { MapProps } from 'react-map-gl/mapbox';

// ==============================|| MAP TYPES ||============================== //

export type MapBoxProps = Omit<MapProps, 'fog' | 'terrain'> & {
  projection?: mapboxgl.ProjectionSpecification;
};

export type MapControlProps = {
  minZoom: number;
  maxZoom: number;
  minPitch: number;
  maxPitch: number;
  dragPan: boolean;
  boxZoom: boolean;
  keyboard: boolean;
  touchZoom: boolean;
  dragRotate: boolean;
  scrollZoom: boolean;
  touchPitch: boolean;
  touchRotate: boolean;
  doubleClickZoom: boolean;
  touchZoomRotate: boolean;
};

export type MapControlKeys =
  | 'dragPan'
  | 'dragRotate'
  | 'scrollZoom'
  | 'touchZoom'
  | 'touchRotate'
  | 'keyboard'
  | 'doubleClickZoom'
  | 'minZoom'
  | 'maxZoom'
  | 'minPitch'
  | 'maxPitch';
