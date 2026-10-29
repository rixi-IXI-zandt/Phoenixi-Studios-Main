export type EntityType =
  | 'character'
  | 'organization'
  | 'location'
  | 'culture'
  | 'species'
  | 'discovery'
  | 'item'
  | 'structure'
  | 'room'
  | 'pantheon'
  | 'event'
  | 'note';

export type EvidenceClassification = 'EXPLICIT' | 'INFERRED' | 'UNRESOLVED';
export type CanonState = 'CANON' | 'PROPOSED' | 'UNVERIFIED' | 'CONFLICTING' | 'REJECTED' | 'UNKNOWN';

export interface ProvenanceReference {
  id: string;
  sourceType: 'note' | 'story' | 'scene';
  sourceId: string;
  sourceTitle: string;
  passageSnippet: string;
  paragraphIndex?: number;
  sentenceIndex?: number;
  timestamp: string;
}

export interface CulturalLens {
  id: string;
  targetEntityId: string; // Culture or entity ID being perceived
  targetEntityName: string;
  perspectiveText: string;
  sourceReferences: ProvenanceReference[];
}

export interface EntityRelationship {
  id: string;
  sourceId: string;
  sourceName?: string;
  targetId: string;
  targetName?: string;
  relationshipType: string; // e.g., "Member of", "Located in", "Owns", "Perceives", "Allied with", "Parent of", "Appears in"
  description?: string;
  direction: 'directed' | 'bi-directional';
  isExtracted?: boolean;
  evidenceClassification?: EvidenceClassification;
  sourceReferences: ProvenanceReference[];
}

export interface Entity {
  id: string;
  projectId: string;
  type: EntityType;
  name: string;
  aliases: string[];
  description: string;
  status: string; // Active, Historic, Unknown, etc.
  tags: string[];
  images: string[];
  relationships: EntityRelationship[];
  sourceReferences: ProvenanceReference[];
  customFields: Record<string, any>;
  customStats: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  canonState: CanonState;

  // Type-specific properties
  // Character
  personality?: string;
  motivation?: string;
  history?: string;
  appearance?: string;
  speciesId?: string;
  cultureId?: string;
  affiliationIds?: string[];
  locationId?: string;
  itemIds?: string[];

  // Organization
  orgType?: string;
  leadershipIds?: string[];
  memberIds?: string[];
  parentOrgId?: string;
  childOrgIds?: string[];

  // Location
  locationType?: string;
  parentLocationId?: string;
  childLocationIds?: string[];
  inhabitantIds?: string[];

  // Culture
  values?: string;
  customs?: string;
  traditions?: string;
  rituals?: string;
  language?: string;
  mythology?: string;
  socialStructures?: string;
  culturalLenses?: CulturalLens[];

  // Species
  biology?: string;
  habitat?: string;

  // Discovery
  discoveryType?: 'technology' | 'magic' | 'scientific' | 'natural_phenomena' | 'world_mechanic' | 'other';
  mechanism?: string;

  // Item
  itemType?: string;
  ownerId?: string;
  previousOwnerIds?: string[];

  // Structure / Room
  structureId?: string;
  roomIds?: string[];
  occupantIds?: string[];

  // Pantheon
  deityIds?: string[];
  domains?: string;

  // Event / Timeline
  dateText?: string;
  approximateDateText?: string; // e.g. "approximately 300 years before present"
  dateRangeText?: string;
  participantIds?: string[];
  consequences?: string;
}

export type FieldType =
  | 'text'
  | 'longtext'
  | 'number'
  | 'boolean'
  | 'date'
  | 'select'
  | 'multiselect'
  | 'entity_ref'
  | 'entity_ref_list'
  | 'image'
  | 'url'
  | 'richtext';

export interface TemplateField {
  id: string;
  name: string;
  fieldType: FieldType;
  options?: string[];
  required?: boolean;
  defaultValue?: any;
}

export interface CustomTemplate {
  id: string;
  projectId: string;
  entityType: EntityType;
  name: string;
  description?: string;
  fields: TemplateField[];
}

export interface Scene {
  id: string;
  chapterId: string;
  title: string;
  prose: string;
  summary: string;
  povCharacterId?: string;
  appearingCharacterIds: string[];
  locationId?: string;
  dateTimeText?: string;
  plotline?: string;
  plotBeat?: string;
  tags: string[];
  wordCount: number;
  order: number;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  storyId: string;
  title: string;
  summary: string;
  order: number;
  scenes: Scene[];
}

export interface Story {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  plot: string;
  summary: string;
  chapters: Chapter[];
  participatingEntityIds: string[];
  tags: string[];
  updatedAt: string;
}

export interface PlotThread {
  id: string;
  projectId: string;
  storyId: string;
  title: string;
  description: string;
  status: 'active' | 'unresolved' | 'resolved';
  associatedSceneIds: string[];
  associatedCharacterIds: string[];
}

export interface Note {
  id: string;
  projectId: string;
  title: string;
  content: string;
  tags: string[];
  entityReferences: string[];
  updatedAt: string;
}

export interface MapMarker {
  id: string;
  locationId: string;
  x: number; // percentage or px coordinate
  y: number;
  label?: string;
}

export interface MapObject {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  imageUrl?: string;
  markers: MapMarker[];
}

export interface Asset {
  id: string;
  projectId: string;
  title: string;
  url: string;
  tags: string[];
  associatedEntityIds: string[];
  createdAt: string;
}

export interface ExtractedFact {
  attributeName?: string;
  dateText?: string;
  id: string;
  projectId: string;
  sourceNoteId: string;
  sourceNoteTitle: string;
  entityName: string;
  entityType: EntityType;
  factType: 'entity' | 'relationship' | 'event' | 'attribute';
  evidenceClassification: EvidenceClassification;
  factDetail: string;
  sourcePassage: string;
  confidence: number;
  status: 'PROPOSED' | 'APPROVED' | 'REJECTED' | 'CONFLICTING';
  canonState: CanonState;
  targetEntityName?: string;
  relationshipType?: string;
  possibleMatchEntityId?: string;
  conflictDetails?: string;
  timestamp: string;
}

export interface CanonConflict {
  entityId?: string;
  factId?: string;
  id: string;
  projectId: string;
  entityName: string;
  attributeName: string;
  factA: { text: string; source: ProvenanceReference };
  factB: { text: string; source: ProvenanceReference };
  status: 'unresolved' | 'resolved_A' | 'resolved_B';
  resolvedValue?: string;
}

export interface ExtractionLog {
  id: string;
  projectId: string;
  timestamp: string;
  sourceNoteTitle: string;
  entitiesFound: number;
  relationshipsFound: number;
  eventsFound: number;
  pendingReview: number;
  conflictsCount: number;
  unresolvedCount: number;
}

export interface Bookmark {
  id: string;
  type: 'entity' | 'story' | 'note' | 'scene' | 'image';
  targetId: string;
  title: string;
  subtitle?: string;
}

export interface NavigationHistoryItem {
  type: 'entity' | 'story' | 'note' | 'view' | 'scene';
  targetId: string;
  title: string;
  timestamp: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
