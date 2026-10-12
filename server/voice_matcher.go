package server

import (
	"errors"
	"sort"
	"strings"
)

var errTranscriptRequired = errors.New("transcript is required before voice ASR integration is enabled")

func MatchVoiceDemand(input VoiceDemandInput, resources []ResourceProfile) (VoiceDemandResult, error) {
	transcript := strings.TrimSpace(input.Transcript)
	if transcript == "" {
		return VoiceDemandResult{}, errTranscriptRequired
	}

	category := inferCategory(transcript)
	city := firstNonEmpty(input.City, inferCity(transcript), "成都")
	district := firstNonEmpty(input.District, inferDistrict(transcript))
	matches := matchResources(category, city, district, transcript, resources)

	status := "waiting"
	message := "暂时没有合适资源，已进入等待匹配"
	if len(matches) > 0 {
		status = "matched"
		message = "已匹配到合适资源，正在通知资源方联系你"
	}

	return VoiceDemandResult{
		Status:     status,
		Message:    message,
		Transcript: transcript,
		Category:   category,
		City:       city,
		District:   district,
		Matches:    matches,
	}, nil
}

func inferCategory(text string) string {
	rules := []struct {
		category string
		keywords []string
	}{
		{category: "设备租赁", keywords: []string{"冷库", "吊车", "叉车", "设备", "租赁"}},
		{category: "家电维修", keywords: []string{"空调", "洗衣机", "冰箱", "维修", "检修"}},
		{category: "家政保洁", keywords: []string{"保洁", "清洁", "打扫", "油污"}},
		{category: "同城运输", keywords: []string{"运输", "搬运", "冷链", "货车", "配送"}},
		{category: "农机服务", keywords: []string{"农机", "收割机", "播种", "小麦"}},
		{category: "劳务服务", keywords: []string{"工人", "劳务", "临时工", "装卸"}},
		{category: "局部家装", keywords: []string{"防水", "装修", "家装", "修补"}},
	}
	for _, rule := range rules {
		for _, keyword := range rule.keywords {
			if strings.Contains(text, keyword) {
				return rule.category
			}
		}
	}
	return "综合资源"
}

func inferCity(text string) string {
	for _, city := range []string{"成都", "重庆", "上海", "北京", "广州", "深圳"} {
		if strings.Contains(text, city) {
			return city
		}
	}
	return ""
}

func inferDistrict(text string) string {
	for _, district := range []string{"高新区", "锦江区", "成华区", "武侯区", "龙泉驿区", "新津区", "双流区"} {
		if strings.Contains(text, district) {
			return district
		}
	}
	return ""
}

func matchResources(category, city, district, transcript string, resources []ResourceProfile) []ResourceMatch {
	matches := make([]ResourceMatch, 0)
	for _, resource := range resources {
		score, reasons := scoreResource(category, city, district, transcript, resource)
		if score < 75 {
			continue
		}
		matches = append(matches, ResourceMatch{
			ResourceID:         resource.ID,
			Name:               resource.Name,
			Category:           resource.Category,
			District:           bestDistrict(district, resource.Districts),
			Score:              score,
			Reasons:            reasons,
			NotificationStatus: "queued",
			Phone:              resource.PhoneMasked,
		})
	}

	sort.Slice(matches, func(i, j int) bool {
		return matches[i].Score > matches[j].Score
	})
	if len(matches) > 3 {
		return matches[:3]
	}
	return matches
}

func scoreResource(category, city, district, transcript string, resource ResourceProfile) (int, []string) {
	score := 0
	reasons := make([]string, 0, 3)

	if category != "" && resource.Category == category {
		score += 40
		reasons = append(reasons, "品类匹配")
	}
	if city != "" && resource.City == city {
		score += 20
		reasons = append(reasons, "城市匹配")
	}
	if district != "" && contains(resource.Districts, district) {
		score += 25
		reasons = append(reasons, "区域匹配")
	}
	for _, keyword := range resource.Keywords {
		if strings.Contains(transcript, keyword) {
			score += 20
			reasons = append(reasons, "关键词匹配")
			break
		}
	}

	return score, reasons
}

func bestDistrict(target string, districts []string) string {
	if target != "" && contains(districts, target) {
		return target
	}
	if len(districts) > 0 {
		return districts[0]
	}
	return ""
}

func contains(values []string, target string) bool {
	for _, value := range values {
		if value == target {
			return true
		}
	}
	return false
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return value
		}
	}
	return ""
}
