ALTER TABLE "Comment"
ADD CONSTRAINT "Comment_exactly_one_target_check"
CHECK (num_nonnulls("leadId", "dealId") = 1);
