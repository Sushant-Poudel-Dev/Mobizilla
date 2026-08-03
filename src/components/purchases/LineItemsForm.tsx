"use client";

import { useState } from "react";

interface LineItem {
  inventoryItemId: string;
  conditionId: string;
  quantity: number;
  unitCost: number;
}

interface InventoryItem {
  id: string;
  part_name: string;
  part_code: string | null;
}

interface Condition {
  id: string;
  name: string;
}

interface LineItemFormProps {
  inventoryItems: InventoryItem[];
  conditions: Condition[];
}

export function LineItemsForm({ inventoryItems, conditions }: LineItemFormProps) {
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { inventoryItemId: "", conditionId: "", quantity: 1, unitCost: 0 },
  ]);

  const addLineItem = () => {
    setLineItems([...lineItems, { inventoryItemId: "", conditionId: "", quantity: 1, unitCost: 0 }]);
  };

  const removeLineItem = (index: number) => {
    if (lineItems.length <= 1) return;
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    setLineItems(lineItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    ));
  };

  return (
    <div className="line-items-section">
      <div className="line-items-header">
        <h3>Line Items</h3>
        <button type="button" onClick={addLineItem} className="btn btn-secondary btn-sm">
          + Add Item
        </button>
      </div>

      <div className="line-items-container">
        {lineItems.map((item, index) => (
          <div key={index} className="line-item-row">
            <div className="form-group">
              <label className="form-label">Inventory Item *</label>
              <select
                name={`items[${index}].inventoryItemId`}
                value={item.inventoryItemId}
                onChange={(e) => updateLineItem(index, "inventoryItemId", e.target.value)}
                required
                className="form-input form-select line-item-select"
              >
                <option value="">Select item</option>
                {inventoryItems.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.part_name} {inv.part_code && `(${inv.part_code})`}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Condition *</label>
              <select
                name={`items[${index}].conditionId`}
                value={item.conditionId}
                onChange={(e) => updateLineItem(index, "conditionId", e.target.value)}
                required
                className="form-input form-select line-item-select"
              >
                <option value="">Select condition</option>
                {conditions.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Qty *</label>
              <input
                name={`items[${index}].quantity`}
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateLineItem(index, "quantity", Number(e.target.value))}
                required
                className="form-input line-item-input"
                placeholder="1"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Unit cost *</label>
              <input
                name={`items[${index}].unitCost`}
                type="number"
                step="0.01"
                min="0"
                value={item.unitCost}
                onChange={(e) => updateLineItem(index, "unitCost", Number(e.target.value))}
                required
                className="form-input line-item-input"
                placeholder="0.00"
              />
            </div>

            {lineItems.length > 1 && (
              <button type="button" onClick={() => removeLineItem(index)} className="btn btn-ghost btn-sm remove-line-item">
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <input type="hidden" name="itemCount" value={lineItems.length} />
    </div>
  );
}