<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponCodeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'description' => $this->description,
            'discount_type' => $this->discount_type,
            'discount_value' => $this->discount_value,
            'valid_from' => $this->valid_from,
            'valid_to' => $this->valid_to,
            'max_uses' => $this->max_uses,
            'max_uses_user' => $this->max_uses_user,
            'times_used' => $this->times_used,
            'min_purchase_amount' => $this->min_purchase_amount,
            'campaign_url' => $this->campaign_url,
            'is_active' => (bool) $this->is_active,
            'brand' => new BrandResource($this->whenLoaded('brand')),
            'categories' => CategoryResource::collection($this->whenLoaded('categories')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
