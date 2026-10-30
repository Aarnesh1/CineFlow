
import { useMemo, useState } from "react";
import "../styles/relationships.css";

export default function CharacterRelationshipMap({
  characters = [],
  relationships = [],
}) {
  const [selectedCharacterId, setSelectedCharacterId] = useState(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState(null);

  const width = 900;
  const height = 600;
  const centerX = width / 2;
  const centerY = height / 2;
  const nodeRadius = 44;

  // Arrange characters around the center of the map.
  const nodes = useMemo(() => {
    if (!characters.length) return [];

    const radius = Math.min(220, 100 + characters.length * 12);

    return characters.map((character, index) => {
      const angle =
        -Math.PI / 2 + (2 * Math.PI * index) / characters.length;

      return {
        ...character,
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    });
  }, [characters]);

  const nodeById = useMemo(
    () => new Map(nodes.map((node) => [String(node.id), node])),
    [nodes]
  );

  // Connect the source and target character for every relationship.
  const edges = useMemo(() => {
    return relationships
      .map((relationship) => {
        const source = nodeById.get(
          String(relationship.sourceCharacterId)
        );
        const target = nodeById.get(
          String(relationship.targetCharacterId)
        );

        if (!source || !target) return null;

        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;

        return {
          ...relationship,
          source,
          target,
          startX: source.x + (dx / distance) * nodeRadius,
          startY: source.y + (dy / distance) * nodeRadius,
          endX: target.x - (dx / distance) * nodeRadius,
          endY: target.y - (dy / distance) * nodeRadius,
          labelX: (source.x + target.x) / 2,
          labelY: (source.y + target.y) / 2,
        };
      })
      .filter(Boolean);
  }, [relationships, nodeById]);

  const selectedCharacter = nodes.find(
    (node) => String(node.id) === String(selectedCharacterId)
  );

  const selectedRelationship = edges.find(
    (edge) => String(edge.id) === String(selectedRelationshipId)
  );

  // Find all characters directly connected to the selected character.
  const connectedCharacterIds = useMemo(() => {
    const connected = new Set();

    if (!selectedCharacterId) return connected;

    connected.add(String(selectedCharacterId));

    edges.forEach((edge) => {
      if (
        String(edge.sourceCharacterId) === String(selectedCharacterId)
      ) {
        connected.add(String(edge.targetCharacterId));
      }

      if (
        String(edge.targetCharacterId) === String(selectedCharacterId)
      ) {
        connected.add(String(edge.sourceCharacterId));
      }
    });

    return connected;
  }, [selectedCharacterId, edges]);

  const characterConnections = useMemo(() => {
    if (!selectedCharacterId) return [];

    return edges.filter(
      (edge) =>
        String(edge.sourceCharacterId) === String(selectedCharacterId) ||
        String(edge.targetCharacterId) === String(selectedCharacterId)
    );
  }, [edges, selectedCharacterId]);

  function selectCharacter(event, node) {
    event?.stopPropagation();

    const id = String(node.id);

    setSelectedCharacterId((current) =>
      String(current) === id ? null : id
    );

    setSelectedRelationshipId(null);
  }

  function selectRelationship(event, edge) {
    event?.stopPropagation();

    setSelectedRelationshipId((current) =>
      String(current) === String(edge.id) ? null : String(edge.id)
    );

    setSelectedCharacterId(null);
  }

  function clearSelection() {
    setSelectedCharacterId(null);
    setSelectedRelationshipId(null);
  }

  function handleKeyboard(event, callback) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      callback(event);
    }
  }

  if (characters.length === 0) {
    return (
      <section className="relationship-map">
        <div className="relationship-map-heading">
          <div>
            <h3>Relationship Map</h3>
            <p>Visualize the connections between your characters.</p>
          </div>
        </div>

        <div className="relationship-map-empty">
          Add characters to visualize your story connections.
        </div>
      </section>
    );
  }

  return (
    <section className="relationship-map">
      <div className="relationship-map-heading">
        <div>
          <h3>Relationship Map</h3>
          <p>
            Select a character to explore their connections, or select a
            line to view relationship details.
          </p>
        </div>

        <span className="relationship-map-count">
          {characters.length} characters · {edges.length} connections
        </span>
      </div>

      <div className="relationship-map-canvas">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="group"
          aria-label="Interactive character relationship map"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter
              id="relationship-node-shadow"
              x="-50%"
              y="-50%"
              width="200%"
              height="200%"
            >
              <feDropShadow
                dx="0"
                dy="3"
                stdDeviation="5"
                floodOpacity="0.25"
              />
            </filter>
          </defs>

          {/* Relationship connections */}
          <g className="relationship-map-edges">
            {edges.map((edge) => {
              const edgeId = String(edge.id);
              const isSelected =
                edgeId === String(selectedRelationshipId);

              const touchesSelectedCharacter =
                selectedCharacterId &&
                (String(edge.sourceCharacterId) ===
                  String(selectedCharacterId) ||
                  String(edge.targetCharacterId) ===
                    String(selectedCharacterId));

              const isDimmed = selectedCharacterId
                ? !touchesSelectedCharacter
                : selectedRelationshipId
                  ? !isSelected
                  : false;

              const relationshipLabel =
                edge.relationshipType || "Connection";

              return (
                <g
                  key={edge.id}
                  className={`relationship-map-edge ${
                    isSelected ? "is-selected" : ""
                  } ${isDimmed ? "is-dimmed" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${edge.source.name} and ${edge.target.name}: ${relationshipLabel}`}
                  aria-pressed={isSelected}
                  onClick={(event) => selectRelationship(event, edge)}
                  onKeyDown={(event) =>
                    handleKeyboard(event, (e) =>
                      selectRelationship(e, edge)
                    )
                  }
                >
                  {/* Wide transparent hit target */}
                  <line
                    className="relationship-map-edge-hit-area"
                    x1={edge.startX}
                    y1={edge.startY}
                    x2={edge.endX}
                    y2={edge.endY}
                  />

                  <line
                    className="relationship-map-edge-line"
                    x1={edge.startX}
                    y1={edge.startY}
                    x2={edge.endX}
                    y2={edge.endY}
                  />

                  <rect
                    className="relationship-map-edge-label-bg"
                    x={edge.labelX - 48}
                    y={edge.labelY - 12}
                    width="96"
                    height="24"
                    rx="12"
                  />

                  <text
                    className="relationship-map-edge-label"
                    x={edge.labelX}
                    y={edge.labelY + 4}
                    textAnchor="middle"
                  >
                    {relationshipLabel.length > 14
                      ? `${relationshipLabel.slice(0, 12)}…`
                      : relationshipLabel}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Character nodes */}
          <g className="relationship-map-nodes">
            {nodes.map((node) => {
              const nodeId = String(node.id);
              const isSelected =
                nodeId === String(selectedCharacterId);
              const isConnected = connectedCharacterIds.has(nodeId);

              const isDimmed = selectedCharacterId
                ? !isConnected
                : selectedRelationshipId
                  ? nodeId !==
                      String(selectedRelationship.sourceCharacterId) &&
                    nodeId !==
                      String(selectedRelationship.targetCharacterId)
                  : false;

              return (
                <g
                  key={node.id}
                  className={`relationship-map-node ${
                    isSelected ? "is-selected" : ""
                  } ${
                    isConnected && selectedCharacterId
                      ? "is-connected"
                      : ""
                  } ${isDimmed ? "is-dimmed" : ""}`}
                  transform={`translate(${node.x}, ${node.y})`}
                  filter="url(#relationship-node-shadow)"
                  role="button"
                  tabIndex={0}
                  aria-label={`Select character ${node.name}`}
                  aria-pressed={isSelected}
                  onClick={(event) => selectCharacter(event, node)}
                  onKeyDown={(event) =>
                    handleKeyboard(event, (e) =>
                      selectCharacter(e, node)
                    )
                  }
                >
                  <circle
                    className="relationship-map-node-circle"
                    r={nodeRadius}
                  />

                  <circle
                    className="relationship-map-node-inner"
                    r={nodeRadius - 6}
                  />

                  <text
                    className="relationship-map-node-name"
                    x="0"
                    y="-3"
                    textAnchor="middle"
                  >
                    {(node.name || "Unnamed").length > 12
                      ? `${node.name.slice(0, 10)}…`
                      : node.name || "Unnamed"}
                  </text>

                  <text
                    className="relationship-map-node-caption"
                    x="0"
                    y="14"
                    textAnchor="middle"
                  >
                    CHARACTER
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      <div className="relationship-map-legend">
        <span className="relationship-map-legend-line" />
        <span>Character connection</span>
        <span className="relationship-map-legend-dot" />
        <span>Character</span>
      </div>

      {/* Selected character details */}
      {selectedCharacter && (
        <div className="relationship-selection-panel">
          <div className="relationship-selection-header">
            <div>
              <span className="relationship-selection-eyebrow">
                SELECTED CHARACTER
              </span>

              <h4>{selectedCharacter.name}</h4>

              <p>
                {selectedCharacter.characterRole || "Character"}
              </p>
            </div>

            <button
              type="button"
              className="relationship-clear-button"
              onClick={clearSelection}
            >
              Clear selection
            </button>
          </div>

          {selectedCharacter.description && (
            <p className="relationship-selection-description">
              {selectedCharacter.description}
            </p>
          )}

          <h5>Connections ({characterConnections.length})</h5>

          {characterConnections.length === 0 ? (
            <p className="relationship-selection-empty">
              No relationships have been added for this character yet.
            </p>
          ) : (
            <div className="relationship-connected-list">
              {characterConnections.map((edge) => {
                const otherCharacter =
                  String(edge.sourceCharacterId) ===
                  String(selectedCharacterId)
                    ? edge.target
                    : edge.source;

                return (
                  <button
                    type="button"
                    className="relationship-connected-item"
                    key={edge.id}
                    onClick={() => {
                      setSelectedCharacterId(null);
                      setSelectedRelationshipId(String(edge.id));
                    }}
                  >
                    <span>
                      <strong>{otherCharacter.name}</strong>
                      <small>
                        {edge.relationshipType || "Connection"}
                      </small>
                    </span>

                    <span aria-hidden="true">→</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Selected relationship details */}
      {selectedRelationship && (
        <div className="relationship-selection-panel">
          <div className="relationship-selection-header">
            <div>
              <span className="relationship-selection-eyebrow">
                RELATIONSHIP DETAILS
              </span>

              <h4>
                {selectedRelationship.source.name}
                <span className="relationship-detail-connector">
                  {" "}↔{" "}
                </span>
                {selectedRelationship.target.name}
              </h4>

              <p>
                {selectedRelationship.relationshipType || "Connection"}
              </p>
            </div>

            <button
              type="button"
              className="relationship-clear-button"
              onClick={clearSelection}
            >
              Clear selection
            </button>
          </div>

          <p className="relationship-selection-description">
            {selectedRelationship.description?.trim() ||
              "No description has been added to this relationship yet."}
          </p>

          <div className="relationship-detail-actions">
            <button
              type="button"
              className="relationship-clear-button"
              onClick={() => {
                setSelectedRelationshipId(null);
                setSelectedCharacterId(
                  String(selectedRelationship.sourceCharacterId)
                );
              }}
            >
              View {selectedRelationship.source.name}
            </button>

            <button
              type="button"
              className="relationship-clear-button"
              onClick={() => {
                setSelectedRelationshipId(null);
                setSelectedCharacterId(
                  String(selectedRelationship.targetCharacterId)
                );
              }}
            >
              View {selectedRelationship.target.name}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
