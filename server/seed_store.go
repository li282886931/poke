package server

import (
	"context"
	"fmt"
	"time"
)

type SeedStore struct {
	dashboard Dashboard
	resources []ResourceProfile
}

func NewSeedStore() *SeedStore {
	return &SeedStore{
		dashboard: Dashboard{
			ResidentListings: []map[string]any{
				{"id": "lead-001", "title": "空调不制冷，需要上门检修", "category": "家电维修", "district": "高新区", "distance": "距您 1.2 - 2.0 km", "time": "今天 18:00 后", "status": "matching", "description": "挂机空调近期制冷明显变弱，已清洗滤网，需要有资质的师傅上门检查。", "specs": []string{"挂式空调", "1 台", "今晚可服务"}, "createdAt": "今天 10:24"},
				{"id": "lead-002", "title": "卫生间局部防水修补", "category": "局部家装", "district": "锦江区", "distance": "距您 3.0 - 4.0 km", "time": "本周六上午", "status": "pending_review", "description": "淋浴区墙角有渗水痕迹，需要现场评估并给出修补方案。", "specs": []string{"卫生间", "局部修补"}, "createdAt": "昨天 16:40"},
				{"id": "lead-003", "title": "周末深度保洁，重点厨房油污", "category": "家政保洁", "district": "成华区", "distance": "距您 4.0 - 5.5 km", "time": "本周日上午", "status": "pending_confirmation", "description": "两居室深度保洁，厨房油污较重，需确认是否包含油烟机外部清洁。", "specs": []string{"两居室", "深度保洁", "AI 待确认"}, "createdAt": "今天 09:18"},
			},
			MasterMatches: []map[string]any{
				{"id": "match-001", "listingId": "lead-001", "title": "空调不制冷，需要上门检修", "category": "家电维修", "district": "高新区", "distance": "1.2 - 2.0 km", "time": "今天 18:00 后", "publishTime": "10 分钟前", "status": "priority", "priorityOwnerId": "master-01", "priorityText": "优先窗口剩余 09:42", "creditCost": 8, "reason": []string{"服务范围符合", "空调检修能力匹配", "可服务时间匹配"}},
				{"id": "match-002", "listingId": "lead-003", "title": "滚筒洗衣机异响检查", "category": "家电维修", "district": "武侯区", "distance": "3.0 - 4.5 km", "time": "明天 09:00 - 12:00", "publishTime": "35 分钟前", "status": "available", "creditCost": 6, "reason": []string{"服务范围符合", "洗衣机检修能力匹配"}},
			},
			Messages: []map[string]any{
				{"id": "msg-1", "title": "需求已进入匹配", "content": "空调检修需求已通过核验，正在为你匹配服务资源。", "time": "10:26", "type": "match", "read": false},
				{"id": "msg-2", "title": "资质审核通过", "content": "你的家电维修服务范围已生效，可开始接收匹配。", "time": "昨天", "type": "review", "read": false},
			},
			Categories: []string{"家电维修", "家政保洁", "局部家装", "劳务服务", "设备租赁", "农机服务", "同城运输"},
			Credit:     36,
		},
		resources: []ResourceProfile{
			{ID: "res-cold-001", Name: "成都冷库资源调度中心", Category: "设备租赁", City: "成都", Districts: []string{"高新区", "双流区", "龙泉驿区"}, Keywords: []string{"冷库", "冷链", "仓储"}, PhoneMasked: "平台代通知"},
			{ID: "res-crane-001", Name: "龙泉吊装设备队", Category: "设备租赁", City: "成都", Districts: []string{"龙泉驿区", "高新区"}, Keywords: []string{"吊车", "叉车", "短驳"}, PhoneMasked: "平台代通知"},
			{ID: "res-repair-001", Name: "高新区家电维修师傅", Category: "家电维修", City: "成都", Districts: []string{"高新区", "武侯区"}, Keywords: []string{"空调", "洗衣机", "冰箱", "检修"}, PhoneMasked: "平台代通知"},
			{ID: "res-clean-001", Name: "成华深度保洁组", Category: "家政保洁", City: "成都", Districts: []string{"成华区", "锦江区"}, Keywords: []string{"保洁", "油污", "清洁"}, PhoneMasked: "平台代通知"},
			{ID: "res-transport-001", Name: "双流同城运输车队", Category: "同城运输", City: "成都", Districts: []string{"双流区", "高新区"}, Keywords: []string{"运输", "冷链", "配送"}, PhoneMasked: "平台代通知"},
		},
	}
}

func (store *SeedStore) Status() StoreStatus {
	return StoreStatus{Name: "seed", MongoConnected: false}
}

func (store *SeedStore) Dashboard(ctx context.Context) (Dashboard, error) {
	return store.dashboard, nil
}

func (store *SeedStore) CreateListing(ctx context.Context, input ListingInput) (map[string]any, error) {
	return map[string]any{
		"id":          fmt.Sprintf("lead-%d", time.Now().UnixNano()),
		"title":       input.Title,
		"category":    input.Category,
		"district":    input.District,
		"description": input.Description,
		"time":        input.Time,
		"status":      "pending_review",
	}, nil
}

func (store *SeedStore) UnlockMatch(ctx context.Context, input UnlockInput) (map[string]any, error) {
	return map[string]any{
		"unlockId":    fmt.Sprintf("unlock-%d", time.Now().UnixNano()),
		"matchId":     input.MatchID,
		"masterId":    input.MasterID,
		"status":      "unlocked",
		"creditDelta": -8,
		"contact": map[string]any{
			"name":  "李女士",
			"phone": "138 **** 2568",
		},
	}, nil
}

func (store *SeedStore) SubmitVoiceDemand(ctx context.Context, input VoiceDemandInput) (VoiceDemandResult, error) {
	result, err := MatchVoiceDemand(input, store.resources)
	if err != nil {
		return VoiceDemandResult{}, err
	}
	result.LeadID = fmt.Sprintf("voice-lead-%d", time.Now().UnixNano())
	return result, nil
}
